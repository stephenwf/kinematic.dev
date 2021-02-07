export type Repository = {
  id: null;
  branch: string;
  name: string;
  full_name: string;
  default_branch: string;
  description: string;
  stargazers_count: number;
  language: string;
  size: number;
  private: boolean;
  fork: boolean;
  updated_at: string;
  permissions: { admin: boolean; push: boolean; pull: boolean };
};
