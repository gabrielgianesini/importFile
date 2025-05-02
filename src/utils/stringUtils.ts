export function removeAccents(str: string): string {
  try {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x00-\x7F]/g, "");
  } catch (error) {
    return str
      .replace(/[áàâãä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[íìîï]/g, "i")
      .replace(/[óòôõö]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[ÁÀÂÃÄ]/g, "A")
      .replace(/[ÉÈÊË]/g, "E")
      .replace(/[ÍÌÎÏ]/g, "I")
      .replace(/[ÓÒÔÕÖ]/g, "O")
      .replace(/[ÚÙÛÜ]/g, "U")
      .replace(/[Ç]/g, "C");
  }
}

export function removeAccentsFromObject(data: any): any {
  const result: any = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const fixedKey = removeAccents(key);
      let value = data[key];

      if (typeof value === "string") {
        value = removeAccents(value);
      }

      result[fixedKey] = value;
    }
  }

  return result;
}
