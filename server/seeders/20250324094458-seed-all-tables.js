"use strict";

const { hashPassword } = require("../helpers/bcrypt");
const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
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
      const regions = responseRegion.data.meals.map((meal) => ({
        name: meal.strArea,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      regions.push(
        { name: "Indonesian", createdAt: new Date(), updatedAt: new Date() },
        { name: "Other", createdAt: new Date(), updatedAt: new Date() }
      );
      await queryInterface.bulkInsert("Regions", regions, {});

      // Fetch and prepare Recipes
      const mealIds = [];
      for (const region of regions) {
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
          console.error(
            `Failed to fetch details for meal ID: ${mealId}`,
            error
          );
        }
      }
      await queryInterface.bulkInsert("Recipes", recipes, {});
    } catch (error) {
      console.error("Failed to seed data:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Regions", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Recipes", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
