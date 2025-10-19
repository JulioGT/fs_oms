import { Sequelize } from "sequelize";

// Close database connections after tests
afterAll(async () => {
  // Get all sequelize instances and close them
  const instances = Object.values(require.cache)
    .map((module) => module?.exports)
    .filter((exp) => exp instanceof Sequelize);

  for (const instance of instances) {
    await instance.close();
  }
});

// KEEP IT SIMPLE: Use the same database as development
// Don't override DATABASE_URL - use existing development database
