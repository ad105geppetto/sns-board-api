"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("board_hashTags", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "boards",
          key: "id",
        },
      },
      hashTag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "hashTags",
          key: "id",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    return await queryInterface.dropTable("board_hashTags");
  },
};
