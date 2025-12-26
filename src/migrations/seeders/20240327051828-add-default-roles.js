'use strict';

/** @type {import('sequelize-cli').Migration} */
const DefaultRoles = require('../../common/jsons/roles.json')
const constants = require('../../common/utils/model.constants')
module.exports = {
  async up(queryInterface, Sequelize) {
    let roleData = []
    DefaultRoles.map(role => {
      let data = {}
      data.name = role.name
      data.slug = role.slug
      data.deletedAt = null
      data.updatedAt = new Date()
      data.createdAt = new Date()
      roleData.push(data)
    })
    await queryInterface.bulkInsert(constants.RoleModel, roleData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(constants.RoleModel, null, {});
  },
};
