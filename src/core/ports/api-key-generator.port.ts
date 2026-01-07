export type ApiKeyGeneratorOutput = {
  plaintext: string;
  hashed: string;
  keyRef: string;
};

export type ApiKeyGenerator = {
  generate(): Promise<ApiKeyGeneratorOutput>;
};
