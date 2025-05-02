import Fastify, { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import { importFileController } from "./controllers/importFile.controller";
import { sendCsvFileController } from "./controllers/sendCsvFile.controller";

class App {
  private fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({
      logger: true,
    });
  }

  async execute() {
    await this.fastify.register(multipart, {
      attachFieldsToBody: true,
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });

    await this.fastify.register(importFileController.register);
    await this.fastify.register(sendCsvFileController.register);

    try {
      await this.fastify.listen({ port: 3000 });
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

new App().execute();
