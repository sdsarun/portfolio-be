import { type PaginationMeta } from "../../shared/types/pagination.types";

export type ApiKeyItem = {
  id: string;
  keyRef: string;
  createdAt: string;
  status: "active" | "revoked";
};

export type GetApiKeysOutput = {
  data: ApiKeyItem[];
  meta: {
    pagination: PaginationMeta;
  };
};
