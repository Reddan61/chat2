import {
  LoginResponseDataType,
  RegistrationResponseDataType,
} from "../../API/Auth";
import { getAuthToken, removeAuthToken, setAuthToken } from "../../Utils/auth";
import { ActionsHandlerType, ThunkType } from "./../store";

export enum AUTH_REDUCERS_TYPES {
  REGISTRATION = "REGISTRATION",
  LOGIN = "LOGIN",
  ISLOGINNED = "ISLOGINNED",
  UPDATEAVATAR = "UPDATEAVATAR",
  LOGOUT = "LOGOUT",
}

const initialState = {
  token: null as string | null,
  email: null as string | null,
  username: null as string | null,
  confirmed: false,
  id: null as string | null,
  isAuth: false,
  avatarURL: null as string | null,
};

type InitialState = typeof initialState;
type Actions = typeof AuthReducerActions;
type ReducerAction = ReturnType<Actions[AUTH_REDUCERS_TYPES]>;

const ActionsHandler: ActionsHandlerType<
  AUTH_REDUCERS_TYPES,
  InitialState,
  typeof AuthReducerActions
> = {
  [AUTH_REDUCERS_TYPES.REGISTRATION]: (state) => {
    return { ...state };
  },
  [AUTH_REDUCERS_TYPES.LOGIN]: (state, action) => {
    const { avatar: avatarURL, _id: id, username, token, email } = action.data;

    setAuthToken(token);

    return {
      ...state,
      email,
      username,
      token,
      id,
      avatarURL,
      isAuth: true,
    };
  },
  [AUTH_REDUCERS_TYPES.ISLOGINNED]: (state, action) => {
    const {
      avatar: avatarURL,
      _id: id,
      username,
      confirmed,
      email,
    } = action.data;

    const token = getAuthToken();

    return {
      ...state,
      confirmed,
      username,
      email,
      id,
      avatarURL,
      token,
      isAuth: true,
    };
  },
  [AUTH_REDUCERS_TYPES.UPDATEAVATAR]: (state, action) => {
    return { ...state, avatarURL: action.data.avatar };
  },
  [AUTH_REDUCERS_TYPES.LOGOUT]: (state) => {
    return { ...state, ...initialState };
  },
};

const AuthReducer = (
  state = initialState,
  action: ReducerAction
): InitialState => {
  const handler = ActionsHandler[action.type];

  return handler?.(state, action as any) ?? state;
};

export default AuthReducer;

export const AuthReducerActions = {
  [AUTH_REDUCERS_TYPES.REGISTRATION]: (data: RegistrationResponseDataType) => ({
    type: AUTH_REDUCERS_TYPES.REGISTRATION,
    data,
  }),
  [AUTH_REDUCERS_TYPES.LOGIN]: (data: LoginResponseDataType) => ({
    type: AUTH_REDUCERS_TYPES.LOGIN,
    data,
  }),
  [AUTH_REDUCERS_TYPES.ISLOGINNED]: (data: RegistrationResponseDataType) => ({
    type: AUTH_REDUCERS_TYPES.ISLOGINNED,
    data,
  }),
  [AUTH_REDUCERS_TYPES.UPDATEAVATAR]: (data: UpdateUserType) => ({
    type: AUTH_REDUCERS_TYPES.UPDATEAVATAR,
    data,
  }),
  [AUTH_REDUCERS_TYPES.LOGOUT]: () => ({ type: AUTH_REDUCERS_TYPES.LOGOUT }),
};

export const logOutThunk = (): ThunkType<
  AUTH_REDUCERS_TYPES.LOGOUT,
  Actions
> => {
  return async (dispatch) => {
    try {
      removeAuthToken();

      dispatch(AuthReducerActions[AUTH_REDUCERS_TYPES.LOGOUT]());
    } catch (e) {
      console.log(e);
      return;
    }
  };
};

export type UpdateUserType = {
  confirmed: boolean;
  email: string;
  username: string;
  _id: string;
  avatar: string;
};

export type RegistrationFormDataType = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

export type LoginFormDataType = {
  username: string;
  password: string;
};
