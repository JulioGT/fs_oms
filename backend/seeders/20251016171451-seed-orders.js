"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Truncate before insert for deterministic seeds
    await queryInterface.bulkDelete("orders", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    const { randomUUID } = require("crypto");

    const now = new Date();
    const statuses = ["pending", "completed", "cancelled"]; // 60/30/10 via pattern
    const data = [];

    for (let i = 0; i < 100; i++) {
      // Deterministic-ish pattern without external libs:
      // - status distribution: 6 pending, 3 completed, 1 cancelled per 10
      const mod = i % 10;
      const status = mod < 6 ? statuses[0] : mod < 9 ? statuses[1] : statuses[2];

      // Quantities 1–10 cycling
      const quantity = (i % 10) + 1;

      // Created_at descending: now - i minutes
      const createdAt = new Date(now.getTime() - i * 60 * 1000);
      const updatedAt = createdAt;

      data.push({
        id: randomUUID(),
        customer_name: `Customer ${String(i + 1).padStart(3, "0")}`,
        item: `Item ${(i % 5) + 1}`, // small variety
        quantity,
        status,
        created_at: createdAt,
        updated_at: updatedAt,
        deleted_at: null,
      });
    }

    await queryInterface.bulkInsert("orders", data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("orders", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
