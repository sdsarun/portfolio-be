export type ApiKeyGeneratorOutput = {
  plaintext: string;
  hashed: string;
};

export type ApiKeyGenerator = {
  generate(): Promise<ApiKeyGeneratorOutput>;
};
