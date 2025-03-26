"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe.belongsTo(models.User, { foreignKey: "UserId" });
      Recipe.belongsTo(models.Region, { foreignKey: "RegionId" });
    }
  }
  Recipe.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Recipe name is required" },
          notEmpty: { msg: "Recipe name is required" },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image is required" },
          notEmpty: { msg: "Image is required" },
        },
      },
      ingredient1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First ingredient is required" },
          notEmpty: { msg: "First ingredient is required" },
        },
      },
      ingredient2: DataTypes.STRING,
      ingredient3: DataTypes.STRING,
      ingredient4: DataTypes.STRING,
      ingredient5: DataTypes.STRING,
      ingredient6: DataTypes.STRING,
      ingredient7: DataTypes.STRING,
      ingredient8: DataTypes.STRING,
      ingredient9: DataTypes.STRING,
      ingredient10: DataTypes.STRING,
      ingredient11: DataTypes.STRING,
      ingredient12: DataTypes.STRING,
      ingredient13: DataTypes.STRING,
      ingredient14: DataTypes.STRING,
      ingredient15: DataTypes.STRING,
      ingredient16: DataTypes.STRING,
      ingredient17: DataTypes.STRING,
      ingredient18: DataTypes.STRING,
      ingredient19: DataTypes.STRING,
      ingredient20: DataTypes.STRING,
      measurement1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First measurement is required" },
          notEmpty: { msg: "First measurement is required" },
        },
      },
      measurement2: DataTypes.STRING,
      measurement3: DataTypes.STRING,
      measurement4: DataTypes.STRING,
      measurement5: DataTypes.STRING,
      measurement6: DataTypes.STRING,
      measurement7: DataTypes.STRING,
      measurement8: DataTypes.STRING,
      measurement9: DataTypes.STRING,
      measurement10: DataTypes.STRING,
      measurement11: DataTypes.STRING,
      measurement12: DataTypes.STRING,
      measurement13: DataTypes.STRING,
      measurement14: DataTypes.STRING,
      measurement15: DataTypes.STRING,
      measurement16: DataTypes.STRING,
      measurement17: DataTypes.STRING,
      measurement18: DataTypes.STRING,
      measurement19: DataTypes.STRING,
      measurement20: DataTypes.STRING,
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Instructions are required" },
          notEmpty: { msg: "Instructions are required" },
        },
      },
      RegionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Region is required" },
          notEmpty: { msg: "Region is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required" },
          notEmpty: { msg: "User is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
