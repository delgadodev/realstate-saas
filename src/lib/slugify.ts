export const slugify = (text: string) => {
  return text
    .toLowerCase() // Convertir a minúsculas
    .replace(/[^a-z0-9\s]/g, "") // Eliminar caracteres especiales
    .replace(/\s+/g, "_") // Reemplazar espacios por guiones bajos
    .trim();
};
