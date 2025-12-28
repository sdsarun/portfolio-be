export type UseCase<Input = void, Output = void> = Input extends void
  ? { execute(): Promise<Output> }
  : { execute(input: Input): Promise<Output> };
