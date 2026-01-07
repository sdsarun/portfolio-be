export type GetRepositoryFileInput = {
  file: {
    path: string;
  };
};

export type GetRepositoryFileOutput = {
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string | null;
  };
};

export type UpsertRepositoryFileInput = {
  file: {
    path: string;
    content: string;
  };
  sha?: string; // for update existing
};

export type UpsertRepositoryFileOutput = {
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
};

export type DeleteRepositoryFileInput = {
  file: {
    path: string;
  };
  sha: string;
};

export type DeleteRepositoryFileOutput = {
  file?: {
    name?: string;
    path?: string;
    sha?: string;
    size?: number;
    url?: string;
  };
};

export type FileStorageRepository = {
  getFile(input: GetRepositoryFileInput): Promise<GetRepositoryFileOutput>;
  upsertFile(input: UpsertRepositoryFileInput): Promise<UpsertRepositoryFileOutput>;
  deleteFile(input: DeleteRepositoryFileInput): Promise<DeleteRepositoryFileOutput>;
};
