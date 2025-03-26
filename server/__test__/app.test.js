const {
  beforeAll,
  afterAll,
  describe,
  test,
  expect,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { default: axios } = require("axios");
const cloudinary = require("cloudinary").v2;

const access_token = signToken({ id: 1 });

beforeAll(async () => {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

  try {
    await sequelize.queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "user1@mail.com",
          password: hashPassword("12345678"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user2@mail.com",
          password: hashPassword("12345678"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const responseRegion = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const regions = responseRegion.data.meals
      .slice(0, 10)
      .map((meal) => ({
        name: meal.strArea,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    await sequelize.queryInterface.bulkInsert("Regions", regions, {});
    const mealIds = [];
    for (const region of regions) {
      if (mealIds.length >= 10) break;
      try {
        const responseMeals = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${region.name}`
        );
        if (responseMeals.data.meals) {
          responseMeals.data.meals.forEach((meal) => {
            mealIds.push(meal.idMeal);
          });
        }
      } catch (error) {
        console.error(
          `Failed to fetch meals for region: ${region.name}`,
          error
        );
      }
    }

    const recipes = [];
    for (const mealId of mealIds) {
      try {
        const responseDetail = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        const mealDetail = responseDetail.data.meals[0];

        const regionIndex = regions.findIndex(
          (region) => region.name === mealDetail.strArea
        );

        const recipe = {
          name: mealDetail.strMeal,
          imageUrl: mealDetail.strMealThumb,
          instructions: mealDetail.strInstructions,
          RegionId: regionIndex + 1,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        for (let i = 1; i <= 20; i++) {
          if (mealDetail[`strIngredient${i}`]) {
            recipe[`ingredient${i}`] = mealDetail[`strIngredient${i}`];
            recipe[`measurement${i}`] = mealDetail[`strMeasure${i}`];
          }
        }

        recipes.push(recipe);
      } catch (error) {
        console.error(`Failed to fetch details for meal ID: ${mealId}`, error);
      }
    }
    await sequelize.queryInterface.bulkInsert("Recipes", recipes, {});
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}, 100000);

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Regions", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Recipes", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET /", () => {
  test("should redirect to /recipes", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/recipes");
  });
});

describe("POST /login", () => {
  test("should return 200 and access_token for valid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "12345678",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  test("should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("should return 400 if email is missing", async () => {
    const response = await request(app).post("/login").send({
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("should return 400 if password is missing", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });
});

describe("POST /auth/google", () => {
  test("should return 500 for missing googleToken", async () => {
    const response = await request(app).post("/auth/google").send({});
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  test("should return 401 if googleToken is invalid", async () => {
    const response = await request(app).post("/auth/google").send({
      googleToken: "invalid-token",
    });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});

describe("POST /register", () => {
  test("should return 201 for successful registration", async () => {
    const response = await request(app).post("/register").send({
      email: "newuser@mail.com",
      password: "12345678",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", "newuser@mail.com");
  });

  test("should return 400 for missing fields", async () => {
    const response = await request(app).post("/register").send({
      email: "",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return 400 if email is invalid", async () => {
    const response = await request(app).post("/register").send({
      email: "invalid-email",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /recipes", () => {
  test("should return 200 and list of recipes", async () => {
    const response = await request(app).get("/recipes");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recipes");
  });

  test("should return 200 and filtered recipes by query", async () => {
    const response = await request(app).get("/recipes?q=Chicken");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recipes");
    expect(response.body.recipes.length).toBeGreaterThan(0);
  });

  test("should return 200 and filtered recipes by regionId", async () => {
    const response = await request(app).get("/recipes?regionId=1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recipes");
    expect(response.body.recipes.length).toBeGreaterThan(0);
  });

  test("should return 200 and paginated recipes", async () => {
    const response = await request(app).get("/recipes?page=1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalData");
    expect(response.body).toHaveProperty("totalPages");
    expect(response.body).toHaveProperty("currentPage", 1);
    expect(response.body).toHaveProperty("recipes");
  });

  test("should return 200 and empty recipes if no match", async () => {
    const response = await request(app).get("/recipes?q=NonExistentRecipe");
    expect(response.status).toBe(200);
    expect(response.body.recipes.length).toBe(0);
  });
});

describe("GET /recipes/:id", () => {
  test("should return 200 and recipe details for valid ID", async () => {
    const response = await request(app).get("/recipes/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
  });

  test("should return 404 for invalid ID", async () => {
    const response = await request(app).get("/recipes/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Recipe not found");
  });

  test("should return 404 if recipe does not exist", async () => {
    const response = await request(app).get("/recipes/9999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Recipe not found");
  });
});

describe("GET /recipes/:id/generate", () => {
  test("should return 200 and generated content", async () => {
    const response = await request(app).get("/recipes/1/generate");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should return 404 for invalid ID", async () => {
    const response = await request(app).get("/recipes/999/generate");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Recipe not found");
  });

  test("should return 500 if generated content parsing fails", async () => {
    jest.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw new Error("ParsingError");
    });
    const response = await request(app).get("/recipes/1/generate");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to parse generated content");
    JSON.parse.mockRestore();
  });

  test("should return 503 for Service Unavailable error", async () => {
    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ message: "Service Unavailable" }),
      })
    );
    const response = await request(app).get("/recipes/1/generate");
    expect(response.status).toBe(503);
    expect(response.body.message).toBe("Service Unavailable");
    global.fetch.mockRestore();
  });
});

describe("GET /regions", () => {
  test("should return 200 and list of regions", async () => {
    const response = await request(app).get("/regions");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Authenticated Endpoints", () => {
  describe("GET /my-recipes", () => {
    test("should return 200 and user's recipes", async () => {
      const response = await request(app)
        .get("/my-recipes")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("recipes");
    });

    test("should return 200 and paginated user's recipes", async () => {
      const response = await request(app)
        .get("/my-recipes?page=1")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalItems");
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("recipes");
    });

    test("should return 200 and empty user's recipes if no match", async () => {
      const response = await request(app)
        .get("/my-recipes?q=NonExistentRecipe")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body.recipes.length).toBe(0);
    });

    test("should return 401 for invalid or expired token (JsonWebTokenError)", async () => {
      const invalidToken = "invalid.token.here";
      const response = await request(app)
        .get("/my-recipes")
        .set("Authorization", `Bearer ${invalidToken}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });

  describe("POST /recipes", () => {
    test("should return 201 for successful recipe creation with file upload", async () => {
      const response = await request(app)
        .post("/recipes")
        .set("Authorization", `Bearer ${access_token}`)
        .field("name", "New Recipe")
        .field("ingredient1", "Chicken")
        .field("measurement1", "1 kg")
        .field("instructions", "Cook the chicken thoroughly.")
        .field("RegionId", 1)
        .attach("file", `${__dirname}/test-image.jpg`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "New Recipe");
      expect(response.body).toHaveProperty("imageUrl");
    }, 10000);

    test("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/recipes")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "",
          ingredient1: "",
          measurement1: "",
          instructions: "",
          RegionId: null,
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /recipes/:id", () => {
    test("should return 200 for successful update", async () => {
      const response = await request(app)
        .put("/recipes/1")
        .set("Authorization", `Bearer ${access_token}`)
        .send({ name: "Updated Recipe" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Updated Recipe");
    });

    test("should return 200 for successful recipe update", async () => {
      const response = await request(app)
        .put("/recipes/1")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "Updated Recipe",
          ingredient1: "Beef",
          measurement1: "500 g",
          instructions: "Cook the beef thoroughly.",
          RegionId: 2,
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Updated Recipe");
    });

    test("should return 404 if recipe does not exist", async () => {
      const response = await request(app)
        .put("/recipes/9999")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "Non-existent Recipe",
          ingredient1: "Fish",
          measurement1: "1 kg",
          instructions: "Cook the fish thoroughly.",
          RegionId: 1,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });

    test("should return 403 if user is not the owner of the recipe", async () => {
      const otherUserToken = signToken({ id: 2 });
      const response = await request(app)
        .put("/recipes/1")
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({ name: "Unauthorized Update" });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  });

  describe("DELETE /recipes/:id", () => {
    test("should return 200 for successful deletion", async () => {
      const response = await request(app)
        .delete("/recipes/1")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toContain("deleted successfully");
    });

    test("should return 404 if recipe does not exist", async () => {
      const response = await request(app)
        .delete("/recipes/9999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });

    test("should return 403 if user is not the owner of the recipe", async () => {
      const otherUserToken = signToken({ id: 2 });
      const response = await request(app)
        .delete("/recipes/2")
        .set("Authorization", `Bearer ${otherUserToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  });
});
