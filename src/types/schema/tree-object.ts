export type TreeObject =
  | {
  id: string;
  type: "directory";
  name: string;
  children: Array<TreeObject>;
}
  | {
  id: string;
  type: "file";
  name: string;
  sha?: string;
};
