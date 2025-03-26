"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      ingredient1: {
        type: Sequelize.STRING,
      },
      ingredient2: {
        type: Sequelize.STRING,
      },
      ingredient3: {
        type: Sequelize.STRING,
      },
      ingredient4: {
        type: Sequelize.STRING,
      },
      ingredient5: {
        type: Sequelize.STRING,
      },
      ingredient6: {
        type: Sequelize.STRING,
      },
      ingredient7: {
        type: Sequelize.STRING,
      },
      ingredient8: {
        type: Sequelize.STRING,
      },
      ingredient9: {
        type: Sequelize.STRING,
      },
      ingredient10: {
        type: Sequelize.STRING,
      },
      ingredient11: {
        type: Sequelize.STRING,
      },
      ingredient12: {
        type: Sequelize.STRING,
      },
      ingredient13: {
        type: Sequelize.STRING,
      },
      ingredient14: {
        type: Sequelize.STRING,
      },
      ingredient15: {
        type: Sequelize.STRING,
      },
      ingredient16: {
        type: Sequelize.STRING,
      },
      ingredient17: {
        type: Sequelize.STRING,
      },
      ingredient18: {
        type: Sequelize.STRING,
      },
      ingredient19: {
        type: Sequelize.STRING,
      },
      ingredient20: {
        type: Sequelize.STRING,
      },
      measurement1: {
        type: Sequelize.STRING,
      },
      measurement2: {
        type: Sequelize.STRING,
      },
      measurement3: {
        type: Sequelize.STRING,
      },
      measurement4: {
        type: Sequelize.STRING,
      },
      measurement5: {
        type: Sequelize.STRING,
      },
      measurement6: {
        type: Sequelize.STRING,
      },
      measurement7: {
        type: Sequelize.STRING,
      },
      measurement8: {
        type: Sequelize.STRING,
      },
      measurement9: {
        type: Sequelize.STRING,
      },
      measurement10: {
        type: Sequelize.STRING,
      },
      measurement11: {
        type: Sequelize.STRING,
      },
      measurement12: {
        type: Sequelize.STRING,
      },
      measurement13: {
        type: Sequelize.STRING,
      },
      measurement14: {
        type: Sequelize.STRING,
      },
      measurement15: {
        type: Sequelize.STRING,
      },
      measurement16: {
        type: Sequelize.STRING,
      },
      measurement17: {
        type: Sequelize.STRING,
      },
      measurement18: {
        type: Sequelize.STRING,
      },
      measurement19: {
        type: Sequelize.STRING,
      },
      measurement20: {
        type: Sequelize.STRING,
      },
      instructions: {
        type: Sequelize.TEXT,
      },
      RegionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Regions",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipes");
  },
};
