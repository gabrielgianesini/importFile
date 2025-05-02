import * as ExcelJS from "exceljs";
import { removeAccentsFromObject } from "../utils/stringUtils";

export class XlsxFileService {
  public async execute(fileBuffer: Buffer): Promise<JSON | null> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);

      if (workbook.worksheets.length === 0) {
        return null;
      }

      const worksheet = workbook.worksheets[0];

      const jsonData: any[] = [];

      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value ? cell.value.toString() : "");
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowData: Record<string, any> = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber <= headers.length) {
            const header = headers[colNumber - 1];
            rowData[header] = cell.value ? cell.value.toString() : "";
          }
        });

        if (Object.keys(rowData).length > 0) {
          jsonData.push(rowData);
        }
      });

      if (jsonData.length === 0) {
        return null;
      }

      const results = jsonData.map((row) => removeAccentsFromObject(row));

      return JSON.parse(JSON.stringify(results));
    } catch (error) {
      console.error("Erro ao processar arquivo XLSX:", error);
      return null;
    }
  }
}
