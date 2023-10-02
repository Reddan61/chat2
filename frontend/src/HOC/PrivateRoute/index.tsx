import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/store";

export const PrivateRoute: FC = ({ children }) => {
  const { isAuth } = useAppSelector((state) => state.AuthPage);

  if (!isAuth) {
    return <Navigate to={"/auth"} />;
  }

  return <>{children}</>;
};
