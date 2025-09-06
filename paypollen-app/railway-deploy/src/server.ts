import { app } from "./index";
import { config } from "./config/env";
import { connectMongo } from "./db/mongo";
import { logger } from "./config/logger";

async function startServer() {
  try {
    // Connect to MongoDB
    await connectMongo();
    logger.info("Connected to MongoDB");

    // Start the server
    const server = app.listen(config.PORT, () => {
      logger.info(
        `Server running on port ${config.PORT} in ${config.NODE_ENV} mode`,
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received. Shutting down gracefully...");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
