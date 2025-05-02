import { createInterface } from "readline";
import { Readable } from "stream";
import { removeAccentsFromObject } from "../utils/stringUtils";

export class TxtFileService {
  public async execute(fileBuffer: Buffer): Promise<JSON | null> {
    try {
      const content = fileBuffer.toString("latin1");
      const buffer = Buffer.from(content, "utf8");

      const readable = Readable.from(buffer);
      const rl = createInterface({
        input: readable,
        crlfDelay: Infinity,
      });

      const results: any[] = [];
      let lineNumber = 0;

      for await (const line of rl) {
        if (line.trim() === "") continue;

        lineNumber++;

        const cleanedLine = line.trim();
        const fixedLine = removeAccentsFromObject({ linha: cleanedLine, numero: lineNumber });
        results.push(fixedLine);
      }

      return JSON.parse(JSON.stringify(results));
    } catch (error) {
      return null;
    }
  }
}
