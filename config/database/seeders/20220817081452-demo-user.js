module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});  */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          nama: "John",
          email: "john@gmail.com",
          password: "12345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Wowo",
          email: "wowo@gmail.com",
          password: "12345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};

