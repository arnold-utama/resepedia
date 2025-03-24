const { Op } = require("sequelize");
const { Recipe, Region } = require("../models");

class RecipeController {
  static async getAll(req, res, next) {
    try {
      const { q, regionId, page = 1 } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      const where = {};
      if (q) {
        where.name = { [Op.iLike]: `%${q}%` };
      }
      if (regionId) {
        where.RegionId = regionId;
      }

      const recipes = await Recipe.findAndCountAll({
        where,
        include: {
          model: Region,
          attributes: ["name"],
        },
        order: [["name", "ASC"]],
        limit,
        offset,
      });

      res.status(200).json({
        totalItems: recipes.count,
        totalPages: Math.ceil(recipes.count / limit),
        currentPage: parseInt(page),
        recipes: recipes.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        name,
        imageUrl,
        ingredient1,
        ingredient2,
        ingredient3,
        ingredient4,
        ingredient5,
        ingredient6,
        ingredient7,
        ingredient8,
        ingredient9,
        ingredient10,
        ingredient11,
        ingredient12,
        ingredient13,
        ingredient14,
        ingredient15,
        ingredient16,
        ingredient17,
        ingredient18,
        ingredient19,
        ingredient20,
        measurement1,
        measurement2,
        measurement3,
        measurement4,
        measurement5,
        measurement6,
        measurement7,
        measurement8,
        measurement9,
        measurement10,
        measurement11,
        measurement12,
        measurement13,
        measurement14,
        measurement15,
        measurement16,
        measurement17,
        measurement18,
        measurement19,
        measurement20,
        instructions,
        RegionId,
      } = req.body;
      const UserId = req.user.id;
      const newRecipe = await Recipe.create({
        name,
        imageUrl,
        ingredient1,
        ingredient2,
        ingredient3,
        ingredient4,
        ingredient5,
        ingredient6,
        ingredient7,
        ingredient8,
        ingredient9,
        ingredient10,
        ingredient11,
        ingredient12,
        ingredient13,
        ingredient14,
        ingredient15,
        ingredient16,
        ingredient17,
        ingredient18,
        ingredient19,
        ingredient20,
        measurement1,
        measurement2,
        measurement3,
        measurement4,
        measurement5,
        measurement6,
        measurement7,
        measurement8,
        measurement9,
        measurement10,
        measurement11,
        measurement12,
        measurement13,
        measurement14,
        measurement15,
        measurement16,
        measurement17,
        measurement18,
        measurement19,
        measurement20,
        instructions,
        RegionId,
        UserId,
      });

      res.status(201).json(newRecipe);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const {
        name,
        imageUrl,
        ingredient1,
        ingredient2,
        ingredient3,
        ingredient4,
        ingredient5,
        ingredient6,
        ingredient7,
        ingredient8,
        ingredient9,
        ingredient10,
        ingredient11,
        ingredient12,
        ingredient13,
        ingredient14,
        ingredient15,
        ingredient16,
        ingredient17,
        ingredient18,
        ingredient19,
        ingredient20,
        measurement1,
        measurement2,
        measurement3,
        measurement4,
        measurement5,
        measurement6,
        measurement7,
        measurement8,
        measurement9,
        measurement10,
        measurement11,
        measurement12,
        measurement13,
        measurement14,
        measurement15,
        measurement16,
        measurement17,
        measurement18,
        measurement19,
        measurement20,
        instructions,
        RegionId,
      } = req.body;
      const updatedRecipe = await req.recipe.update({
        name,
        imageUrl,
        ingredient1,
        ingredient2,
        ingredient3,
        ingredient4,
        ingredient5,
        ingredient6,
        ingredient7,
        ingredient8,
        ingredient9,
        ingredient10,
        ingredient11,
        ingredient12,
        ingredient13,
        ingredient14,
        ingredient15,
        ingredient16,
        ingredient17,
        ingredient18,
        ingredient19,
        ingredient20,
        measurement1,
        measurement2,
        measurement3,
        measurement4,
        measurement5,
        measurement6,
        measurement7,
        measurement8,
        measurement9,
        measurement10,
        measurement11,
        measurement12,
        measurement13,
        measurement14,
        measurement15,
        measurement16,
        measurement17,
        measurement18,
        measurement19,
        measurement20,
        instructions,
        RegionId,
      });
      res.status(200).json(updatedRecipe);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await req.recipe.destroy();
      res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecipeController;
