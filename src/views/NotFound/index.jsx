import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { getHelpUrl } from '../../utils/resource';
import { SUBMIT_TICKET_URL } from '../../constants';
import FilledButton from '../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '20vh',
    textAlign: 'center',
  },
  title: {
    fontSize: 80,
  },
  subtitle: {
    margin: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(5),
  },
}));

export default function NotFound() {
  const classes = useStyles();
  const history = useHistory();
  const helpUrl = getHelpUrl();

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>404</Typography>

      <Typography variant="h3" className={classes.subtitle}>
        This is not the page that you&apos;re looking for...
      </Typography>

      <Typography variant="body1">
        We can&apos;t find the page you&apos;re looking for.
        But don&apos;t worry! You can either return
        <br />
        to the previous page, <a href={SUBMIT_TICKET_URL}>submit a ticket</a>,
        or <a href={helpUrl}>check our Help Center</a>.
      </Typography>

      <div className={classes.button}>
        <FilledButton onClick={() => history.goBack()}>
          Go back and prosper!
        </FilledButton>
      </div>
    </div>
  );
}
