import {
  type DeleteRepositoryFileInput,
  type UpsertRepositoryFileInput,
  type UpsertRepositoryFileOutput,
  type FileStorageRepositoryPort,
  type DeleteRepositoryFileOutput,
  type GetRepositoryFileInput,
  type GetRepositoryFileOutput
} from "../../core/ports/file-storage-repository.port";
import { Octokit, type OctokitOptions } from "@octokit/core";

export type GithubFileStorageOptions = Pick<OctokitOptions, "log"> & {
  token: string;
  repoName: string;
  directoryPath: string;
  apiVersion: string;
  branch: string;
};

export class GithubFileStorageRepository implements FileStorageRepositoryPort {
  private readonly client: Octokit;
  private readonly repoName: string;
  private readonly directoryPath: string;
  private readonly apiVersion: string;
  private readonly branch: string;

  constructor({
    token,
    repoName,
    directoryPath,
    apiVersion,
    branch,
    ...options
  }: GithubFileStorageOptions) {
    this.client = new Octokit({ auth: token, ...options });
    this.repoName = repoName;
    this.directoryPath = directoryPath;
    this.apiVersion = apiVersion;
    this.branch = branch;
  }

  async getFile(input: GetRepositoryFileInput): Promise<GetRepositoryFileOutput> {
    try {
      const userInfo = await this.getAuthenticatedUser();

      const result = await this.client.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: userInfo.login,
        repo: this.repoName,
        path: this.joinPath(this.directoryPath, input.file.path),
        ref: this.branch,
        headers: {
          "X-GitHub-Api-Version": this.apiVersion
        }
      });

      if ("type" in result.data && result.data.type === "file") {
        return {
          success: true,
          data: {
            file: {
              name: result.data?.name,
              path: result.data?.path,
              size: result.data?.size,
              sha: result.data?.sha,
              url: result.data?.download_url
            }
          }
        };
      }

      throw new Error(
        `Expected a file at "${input.file.path}", but GitHub returned a directory or unsupported content type.`
      );
    } catch (error) {
      return {
        success: false,
        error: {
          code: "GITHUB_FILE_GET_ERROR",
          message: error?.message || "Something went wrong while getting a file from GitHub",
          cause: error
        }
      };
    }
  }

  async upsertFile(input: UpsertRepositoryFileInput): Promise<UpsertRepositoryFileOutput> {
    try {
      const userInfo = await this.getAuthenticatedUser();

      const result = await this.client.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: userInfo.login,
        repo: this.repoName,
        path: this.joinPath(this.directoryPath, input.file.path),
        content: input.file.content,
        branch: this.branch,
        message: `chore(portfolio): ${input?.sha ? "replaced file" : "added file"} ${input.file.path}`,
        headers: {
          "X-GitHub-Api-Version": this.apiVersion
        },
        sha: input?.sha
      });

      return {
        success: true,
        data: {
          file: {
            name: result.data.content?.name,
            path: result.data.content?.path,
            size: result.data.content?.size,
            sha: result.data.content?.sha,
            url: result.data.content?.download_url
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "GITHUB_FILE_UPSERT_ERROR",
          message: error?.message || "Something went wrong while upserting a file in GitHub",
          cause: error
        }
      };
    }
  }

  async deleteFile(input: DeleteRepositoryFileInput): Promise<DeleteRepositoryFileOutput> {
    try {
      const { login } = await this.getAuthenticatedUser();

      const result = await this.client.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
        owner: login,
        repo: this.repoName,
        path: this.joinPath(this.directoryPath, input.file.path),
        branch: this.branch,
        message: `chore(portfolio): deleted file ${input.file.path}`,
        sha: input.sha,
        headers: {
          "X-GitHub-Api-Version": this.apiVersion
        }
      });

      return {
        success: true,
        data: {
          file: {
            name: result.data.content?.name,
            path: result.data.content?.path,
            size: result.data.content?.size,
            sha: result.data.content?.sha,
            url: result.data.content?.download_url
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "GITHUB_FILE_DELETE_ERROR",
          message: error?.message || "Something went wrong while deleting a file from GitHub",
          cause: error
        }
      };
    }
  }

  private joinPath(dir: string = "", filePath: string = "") {
    const directory = dir.replace(/\/+$/, "");
    const file = filePath.replace(/^\/+/, "");
    return directory ? `${directory}/${file}` : file;
  }

  private async getAuthenticatedUser() {
    const userInfo = await this.client.request("GET /user");
    return userInfo.data;
  }
}
