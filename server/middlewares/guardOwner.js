const { Recipe } = require("../models");

const guardOwner = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return next({ statusCode: 404, message: "Recipe not found" });
    }
    if (recipe.userId !== req.user.id) {
      return next({ statusCode: 403, message: "Forbidden" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = guardOwner;
