import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import { CsvFileService } from "../services/csvFile.service";
import { TxtFileService } from "../services/txtService.service";
import { XlsxFileService } from "../services/xlsxFile.service";
import { MultipartFile } from "@fastify/multipart";

interface MultipartRequestBody {
  file?: MultipartFile;
  [key: string]: any;
}

class ImportFileController {
  public async register(fastify: FastifyInstance) {
    const csvFileService = new CsvFileService();
    const txtFileService = new TxtFileService();
    const xlsxFileService = new XlsxFileService();

    fastify.post("/importFile", async (request: FastifyRequest<{ Body: MultipartRequestBody }>, reply: FastifyReply) => {
      if (!request.body || !request.body.file || !request.body.file.filename) {
        return reply.code(400).send({ error: "Nenhum arquivo enviado." });
      }

      const fileData = request.body.file;

      const fileExtension = path.extname(fileData.filename).toLowerCase();

      const allowedExtensions = [".csv", ".xlsx", ".xls", ".txt"];
      if (!allowedExtensions.includes(fileExtension)) {
        return reply.code(400).send({ error: "Arquivo inválido." });
      }

      try {
        let jsonData: JSON | null = null;

        switch (fileExtension) {
          case ".csv":
            jsonData = await csvFileService.execute(await fileData.toBuffer());
            break;
          case ".txt":
            jsonData = await txtFileService.execute(await fileData.toBuffer());
            break;
          case ".xlsx":
          case ".xls":
            jsonData = await xlsxFileService.execute(await fileData.toBuffer());
            break;
        }

        if (jsonData === null) {
          return reply.code(400).send({ error: "Formato de arquivo não processado." });
        }

        reply.send(jsonData);
      } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        reply.code(500).send({ error: "Erro ao processar o arquivo." });
      }
    });
  }
}

export const importFileController = new ImportFileController();
