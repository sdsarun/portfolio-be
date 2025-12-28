export type UpsertProfileContactInput = {
  contacts?: {
    id?: string;
    type?: string | null;
    value?: string | null;
    label?: string | null;
    displayValue?: string | null;
    displayOrder?: number | null;
  }[];
};
