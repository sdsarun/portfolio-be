type FileStorageRepositoryOutput<Data = any> = {
  success: boolean;
  data: Data;
};

export type UpsertRepositoryFileInput = {
  file: {
    path: string;
    content: string;
  };
  repository?: {
    owner: string;
    name: string;
  };
  commit?: {
    message: string;
    branch: string;
    committer: {
      name: string;
      email: string;
    };
  };
  previousSha?: string; // for update existing
};

export type UpsertRepositoryFileOutput = FileStorageRepositoryOutput<{
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
  // commit: {
  //   sha: string;
  //   message: string;
  //   author: {
  //     name: string;
  //     email: string;
  //     date: string;
  //   };
  // };
}>;

export type DeleteRepositoryFileInput = {
  repository: {
    owner: string;
    name: string;
  };
  file: {
    path: string;
  };
  commit: {
    message: string;
    branch: string;
    committer: {
      name: string;
      email: string;
    };
  };
  sha: string;
};

export type DeleteRepositoryFileOutput = FileStorageRepositoryOutput<{
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
  // commit: {
  //   sha: string;
  //   message: string;
  //   author: {
  //     name: string;
  //     email: string;
  //     date: string;
  //   };
  // };
}>;

export type FileStorageRepositoryPort = {
  upsertFile(input: UpsertRepositoryFileInput): Promise<UpsertRepositoryFileOutput>;
  deleteFile(input: DeleteRepositoryFileInput): Promise<DeleteRepositoryFileOutput>;
};
