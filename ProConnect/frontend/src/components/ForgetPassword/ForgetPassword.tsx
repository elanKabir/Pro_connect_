import React from 'react';
import { Button, Grid, TextField } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState<string>('');

  const handleForgetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(email);
  };

  <form>
    <Grid container>
      <Grid item>
        <TextField
          required
          id="email-required"
          label="Email"
          fullWidth
          defaultValue={email}
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item>
        {/* <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleForgetPassword}
        >
          Submit
        </Button> */}
      </Grid>
    </Grid>
  </form>;
};

export default ForgotPassword;
