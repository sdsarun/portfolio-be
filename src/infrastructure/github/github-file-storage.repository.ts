import {
  type DeleteRepositoryFileInput,
  type UpsertRepositoryFileInput,
  type UpsertRepositoryFileOutput,
  type FileStorageRepositoryPort,
  DeleteRepositoryFileOutput
} from "../../core/ports/file-storage-repository.port";
import { Octokit, type OctokitOptions } from "@octokit/core";

export type GithubFileStorageOptions = Pick<OctokitOptions, "log"> & {
  token: string;
  repoName: string;
};

export class GithubFileStorageRepository implements FileStorageRepositoryPort {
  private readonly client: Octokit;
  private readonly repoName: string;

  constructor({ token, repoName, ...options }: GithubFileStorageOptions) {
    this.client = new Octokit({ auth: token, ...options });
    this.repoName = repoName;
    void this.repoName;
  }

  async upsertFile(input: UpsertRepositoryFileInput): Promise<UpsertRepositoryFileOutput> {
    console.log(
      "[LOG] - github-file-storage.repository.ts:25 - GithubFileStorageRepository - upsertFile - input:",
      input
    );
    await this.ensureUserInfo();
    // const result = await this.client.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    //   owner: input.repository.owner,
    //   repo: input.repository.name ?? this.repoName,
    //   path: input.file.path,
    //   content: input.file.content,
    //   message: input.commit.message,
    //   branch: input.commit.branch,
    //   committer: input.commit.committer,
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28"
    //   },
    //   sha: input?.previousSha
    // });
    // return {
    //   success: result.status >= 200 && result.status <= 299,
    //   data: {
    //     file: {
    //       name: result.data.content?.name,
    //       path: result.data.content?.path,
    //       size: result.data.content?.size,
    //       sha: result.data.content?.sha,
    //       url: result.data.content?.download_url
    //     }
    //   }
    // };

    return {
      success: true,
      data: null as any
    };
  }

  deleteFile(input: DeleteRepositoryFileInput): Promise<DeleteRepositoryFileOutput> {
    console.log(
      "[LOG] - github-file-storage.repository.ts:59 - GithubFileStorageRepository - deleteFile - input:",
      input
    );
    throw new Error("Method not implemented.");
  }

  private async ensureUserInfo() {
    const userInfo = await this.client.request("GET /user");
    console.log(
      "[LOG] - github-file-storage.repository.ts:57 - GithubFileStorageRepository - ensureUserInfo - userInfo:",
      userInfo
    );
  }
}
