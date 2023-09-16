export interface User {
  avatar: string;
  _id: string;
  username: string;
}

export type Users = User[];

export interface GetUsers {
  page?: number;
  search?: string;
}