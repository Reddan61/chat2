import { useAppSelector } from "../Redux/store";
import {
  AUTH_REDUCERS_TYPES,
  AuthReducerActions,
  LoginFormDataType,
  RegistrationFormDataType,
  logOutThunk,
} from "../Redux/Reducers/authReducer";
import { useDispatch } from "react-redux";
import { AuthApi } from "../API/Auth";
import { isSuccess } from "../Utils/api";
import { useSnackbar } from "notistack";

interface ResetPasswordData {
  password: string;
  password2: string;
  resetToken: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuth } = useAppSelector((state) => state.AuthPage);

  const getToken = () => {
    return localStorage.getItem("token") ?? null;
  };

  const checkAuth = async () => {
    try {
      const response = await AuthApi.me();

      if (isSuccess(response.status)) {
        dispatch(
          AuthReducerActions[AUTH_REDUCERS_TYPES.ISLOGINNED](response.data)
        );

        return true;
      }

      return false;
    } catch {
      dispatch(logOutThunk());

      return false;
    }
  };

  const logOut = () => {
    dispatch(logOutThunk());
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await AuthApi.resetPassword(data);

      if (isSuccess(response.status)) {
        enqueueSnackbar("Пароль изменён");

        return true;
      }

      return false;
    } catch {
      enqueueSnackbar("Что-то пошло не так!");

      return false;
    }
  };

  const login = async (values: LoginFormDataType) => {
    try {
      const response = await AuthApi.login(values);

      if (isSuccess(response.status)) {
        dispatch(AuthReducerActions[AUTH_REDUCERS_TYPES.LOGIN](response.data));
      }
    } catch {
      enqueueSnackbar("Ошибка авторизации", {
        variant: "error",
      });
    }
  };

  const forgot = async (email: string) => {
    try {
      const response = await AuthApi.forgotPassword(email);

      if (isSuccess(response.status)) {
        enqueueSnackbar("Сообщение отправлено на вашу почту");

        return true;
      }

      return false;
    } catch {
      enqueueSnackbar("Что-то пошло не так!", {
        variant: "error",
      });

      return false;
    }
  };

  const register = async (values: RegistrationFormDataType) => {
    try {
      const response = await AuthApi.registration(values);

      if (isSuccess(response.status)) {
        dispatch(AuthReducerActions[AUTH_REDUCERS_TYPES.REGISTRATION](response.data));

        enqueueSnackbar("Успешно!");

        return true;
      }

      return false;
    } catch {
      enqueueSnackbar("Что-то пошло не так!", {
        variant: "error",
      });

      return false;
    }
  };

  return {
    isAuth,
    checkAuth,
    getToken,
    logOut,
    resetPassword,
    login,
    forgot,
    register,
  };
};
