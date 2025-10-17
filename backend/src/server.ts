import "dotenv/config";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import sequelize from "./db";
import ordersRouter from "./routes/orders";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/orders", ordersRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

app.use(errorHandler);

start();

export default app;
