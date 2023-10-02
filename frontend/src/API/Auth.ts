import {
  RegistrationFormDataType,
  LoginFormDataType,
} from "../Redux/Reducers/authReducer";
import { Response, instance } from "./API";

export const AuthApi = {
  registration: ({
    username,
    password,
    email,
    password2,
  }: RegistrationFormDataType) => {
    return instance
      .post<Response<RegistrationResponseDataType>>(`/auth/register`, {
        username,
        password,
        email,
        password2,
      })
      .then((response) => {
        return response.data;
      });
  },
  login: ({ username, password }: LoginFormDataType) => {
    return instance
      .post<Response<LoginResponseDataType>>("/auth/login", {
        username,
        password,
      })
      .then((response) => {
        return response.data;
      });
  },
  me: () => {
    return instance
      .get<Response<MeResponseDataType>>("/users/me")
      .then((response) => {
        return response.data;
      });
  },
  updateAvatar: (data: FormData) => {
    return instance
      .put<Response<UpdateAvatarResponse>>("/usersAvatar", data)
      .then((response) => {
        return response.data;
      });
  },
  forgotPassword: (email: string) => {
    return instance
      .post("/users/fargotPassword", { email })
      .then((response) => {
        return response.data;
      });
  },
  resetPassword: ({
    resetToken,
    password,
    password2,
  }: ResetPasswordAPIType) => {
    return instance
      .post("/users/resetPassword", { resetToken, password, password2 })
      .then((response) => {
        return response.data;
      });
  },
};

type ResetPasswordAPIType = {
  resetToken: string;
  password: string;
  password2: string;
};

export type LoginResponseDataType = {
  confirmed: boolean;
  email: string;
  token: string;
  username: string;
  _id: string;
  avatar: string;
};

export type RegistrationResponseDataType = {
  confirmed: boolean;
  email: string;
  username: string;
  _id: string;
  avatar: string;
};

export type MeResponseDataType = {
  confirmed: boolean;
  email: string;
  username: string;
  _id: string;
  avatar: string;
};

export interface UpdateAvatarResponse {
  avatar: string;
  confirmed: boolean;
  email: string;
  username: string;
  _id: string;
}
