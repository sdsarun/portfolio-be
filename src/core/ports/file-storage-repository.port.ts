type FileStorageRepositoryOutput<Data = any, Error = any> =
  | {
      success: true;
      data: Data;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        cause: Error;
      };
    };

export type GetRepositoryFileInput = {
  file: {
    path: string;
  };
};

export type GetRepositoryFileOutput = FileStorageRepositoryOutput<{
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string | null;
  };
}>;

export type UpsertRepositoryFileInput = {
  file: {
    path: string;
    content: string;
  };
  sha?: string; // for update existing
  // NOTE: not need right now
  // repository?: {
  //   owner: string;
  //   name: string;
  // };
  // commit?: {
  //   message: string;
  //   branch: string;
  //   committer: {
  //     name: string;
  //     email: string;
  //   };
  // };
};

export type UpsertRepositoryFileOutput = FileStorageRepositoryOutput<{
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
}>;

export type DeleteRepositoryFileInput = {
  file: {
    path: string;
  };
  sha: string;
  // NOTE: not need right now
  // repository: {
  //   owner: string;
  //   name: string;
  // };
  // commit: {
  //   message: string;
  //   branch: string;
  //   committer: {
  //     name: string;
  //     email: string;
  //   };
  // };
};

export type DeleteRepositoryFileOutput = FileStorageRepositoryOutput<{
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
}>;

export type FileStorageRepositoryPort = {
  getFile(input: GetRepositoryFileInput): Promise<GetRepositoryFileOutput>;
  upsertFile(input: UpsertRepositoryFileInput): Promise<UpsertRepositoryFileOutput>;
  deleteFile(input: DeleteRepositoryFileInput): Promise<DeleteRepositoryFileOutput>;
};
