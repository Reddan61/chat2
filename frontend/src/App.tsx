import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "./Components/Container";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import Rooms from "./Pages/Rooms";
import Auth from "./Pages/AuthPage/Auth";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import { useAuth } from "./hooks/useAuth";
import { Room } from "./Pages/Room";
import socket from "./Utils/socket";

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const { isAuth, checkAuth } = useAuth();

  useEffect(() => {
    (async () => {
      await checkAuth();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isAuth) socket.connect();

    return () => {
      if (!isAuth) socket.disconnect();
    };
  }, [isAuth]);

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<Room />} />
        <Route index element={<Navigate to={"/profile"} />} />
      </Route>

      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/resetpassword/:token" element={<ResetPassword />} />

      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
};

export default App;
