"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Region.hasMany(models.Recipe, { foreignKey: "RegionId" });
    }
  }
  Region.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Region name is required" },
          notEmpty: { msg: "Region name is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Region",
    }
  );
  return Region;
};
