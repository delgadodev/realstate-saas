const errorCases: { [key: string]: string } = {
  23505: "Este titulo ya esta en uso, por favor elige otro",
};

export const errorHandler = (error: string) => {
  if (errorCases[error]) {
    return errorCases[error];
  }

  return "Error al validar los datos";
};
