import { Sequelize } from "sequelize";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  define: {
    underscored: true,
    paranoid: true,
    timestamps: true,
  },
});

export default sequelize;
