import { Grid } from "@material-ui/core";
import { ResetForm } from "../../Components/ResetForm";

const ResetPassword = () => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <ResetForm />
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
