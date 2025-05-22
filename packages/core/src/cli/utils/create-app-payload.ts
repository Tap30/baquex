type Options = {
  main?: string;
};

export const createAppPayload = async (options?: Options): Promise<void> => {
  const { main } = options ?? {};

  await Promise.resolve(main);
};
