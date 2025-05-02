import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";

class SendCsvFileController {
  public async register(fastify: FastifyInstance) {
    fastify.get("/sendCsvFile", async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const filePath = path.resolve(process.cwd(), "teste.csv");

        if (!fs.existsSync(filePath)) {
          return reply.code(404).send({ error: "Arquivo teste.csv não encontrado" });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));

        const response = await axios.post("http://localhost:3000/importFile", formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        return reply.send(response.data);
      } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
        return reply.code(500).send({
          error: "Erro ao enviar arquivo",
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    });
  }
}

export const sendCsvFileController = new SendCsvFileController();
