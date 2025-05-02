import { parse } from "csv-parse";
import { Readable } from "stream";
import { removeAccentsFromObject } from "../utils/stringUtils";

export class CsvFileService {
  public async execute(fileBuffer: Buffer): Promise<JSON | null> {
    const delimiters = [",", ";", "|", "\t"];

    for (const delimiter of delimiters) {
      try {
        return await this.parseWithDelimiter(fileBuffer, delimiter);
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  private async parseWithDelimiter(fileBuffer: Buffer, delimiter: string): Promise<JSON> {
    const results: any[] = [];

    const content = fileBuffer.toString("latin1");
    const buffer = Buffer.from(content, "utf8");

    const parser = parse({
      delimiter: delimiter,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      encoding: "utf8",
    });

    const data = await new Promise((resolve, reject) => {
      Readable.from(buffer)
        .pipe(parser)
        .on("data", (data) => {
          const fixedData = removeAccentsFromObject(data);
          results.push(fixedData);
        })
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });

    return JSON.parse(JSON.stringify(data));
  }
}
