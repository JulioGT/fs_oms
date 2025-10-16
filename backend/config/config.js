require("dotenv").config();

/**
 * Sequelize CLI configuration.
 * Uses DATABASE_URL for all environments.
 */
module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
};
