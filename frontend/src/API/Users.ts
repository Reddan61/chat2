import { Response, instance } from "./API";

export const UsersAPI = {
  getUsers: (page: number, search: string) => {
    return instance
      .get<Response<UsersResponse>>(
        `/users?pageNumber=${page}&userNameSearch=${search}`
      )
      .then((response) => {
        return response.data;
      });
  },
};

export interface UserResponse {
  _id: string;
  avatar: string;
  username: string;
}

export interface UsersResponse {
  totalPageCount: number;
  users: UserResponse[];
}
