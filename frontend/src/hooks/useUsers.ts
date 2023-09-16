import { useState } from "react";
import { UsersAPI } from "../API/Users";
import { GetUsers, Users } from "../types/Users";
import { isSuccess } from "../Utils/api";
import { useSnackbar } from "notistack";

interface Pagination {
  page: number;
  pages: number;
}

export const useUsers = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pages: 1,
  });
  const [users, setUsers] = useState<Users | null>([]);
  const [isLoading, setLoading] = useState(true);

  const getUsers = async ({ page = 1, search = "" } = {} as GetUsers) => {
    setLoading(true);

    try {
      const response = await UsersAPI.getUsers(page, search);

      if (isSuccess(response.status)) {
        const { totalPageCount, users } = response.data;

        setUsers(users);

        setPagination({
          page,
          pages: totalPageCount,
        });
      }
    } catch {
      enqueueSnackbar("Ошибка получения пользователей", {
        variant: "error",
      });
    }

    setLoading(false);
  };

  return {
    isLoading,
    users,
    pagination,
    getUsers,
  };
};
