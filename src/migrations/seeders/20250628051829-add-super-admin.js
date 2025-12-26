'use strict';

/** @type {import('sequelize-cli').Migration} */
const constants = require('../../common/utils/model.constants')
const varConstants = require('../../common/utils/constants')
const { DefaultRole } = require('../../common/utils/enums/role.enum') 
const { AccessLevelSlug } = require('../../common/utils/enums/status.enum') 
const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface, Sequelize) {
    let roleId = await queryInterface.rawSelect(constants.RoleModel, {
      where: {
        slug: DefaultRole.SUPER_ADMIN,
      },
    }, ['id'])
    console.log("role:", roleId);
    let user = {}
    user.name = 'Super Admin'
    user.email = varConstants.SuperAdminEmail
    user.mobileNoCountryCode = '+91'
    user.mobileNo = '6354084511'
    user.roleId = roleId
    user.password = await bcrypt.hash(varConstants.SuperAdminPassword, 8)
    user.deletedAt = null
    user.updatedAt = new Date()
    user.createdAt = new Date()
    console.log("user:", user);
    await queryInterface.bulkInsert(constants.UserModel, [user], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(constants.UserModel, null, {});
  },
};
