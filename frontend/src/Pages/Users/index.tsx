import { useEffect } from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import CardUser from "../../Components/UserCard";
import UserSearch from "../../Components/UserSearch";
import { useUsers } from "../../hooks/useUsers";

const Users = () => {
  const {
    users,
    pagination: { page, pages },
    isLoading,
    getUsers,
  } = useUsers();

  const changePagiantion = (e: any, value: number) => {
    getUsers({ page: value });
  };

  const onChangeSearch = (search: string) => {
    getUsers({
      search,
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Box>
        <UserSearch onChangeInput={onChangeSearch} />
      </Box>
      <Box
        style={{
          marginTop: "20px",
          flex: "1 1 auto",
        }}
      >
        <Grid container spacing={2}>
          {!isLoading &&
            users?.map((user) => (
              <Grid item xs={3} key={user._id}>
                <CardUser user={user} />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          flex: "0 0 50px",
        }}
      >
        <Pagination
          count={pages}
          shape="rounded"
          showFirstButton
          showLastButton
          page={page}
          onChange={changePagiantion}
          disabled={isLoading}
        />
      </Container>
    </>
  );
};

export default Users;
