import { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { RoomCard } from "../../Components/RoomCard";
import Loader from "../../Components/Loader/Loader";
import { useRooms } from "../../hooks/useRooms";

const Rooms = () => {
  const { getRooms, isLoading, rooms } = useRooms();

  useEffect(() => {
    getRooms();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Grid container spacing={2}>
      {rooms?.map((el) => (
        <Grid item xs={3} key={el._id}>
          <RoomCard room={el} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Rooms;
