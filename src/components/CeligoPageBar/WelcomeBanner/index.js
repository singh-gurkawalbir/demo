import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import actions from '../../../actions';
import IconTextButton from '../../IconTextButton';
import CloseIcon from '../../icons/CloseIcon';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(-2, -1, 2, -2),
    backgroundColor: theme.palette.common.white,
  },
  banner: {
    display: 'flex',
    padding: theme.spacing(1, 0, 1, 3),
    border: `solid 1px ${theme.palette.primary.light}`,
    alignItems: 'center',
  },
  welcomeText: {
    flexGrow: 1,
  },
  feedback: {
    marginRight: theme.spacing(2),
    marginTop: 3,
  },
}));

export default function WelcomeBanner() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleClose = useCallback(() => dispatch(actions.toggleBanner()), [
    dispatch,
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        <div className={classes.welcomeText}>
          <Typography variant="h5">Welcome to the new io!</Typography>
          <Typography variant="body2">
            We’ve got much more in store and welcome your feedback!
          </Typography>
        </div>
        <Typography className={classes.feedback}>
          Send feedback to product_feedback@celigo.com
        </Typography>
        <IconTextButton
          component="a"
          href="/"
          variant="outlined"
          color="primary">
          Switch back <ArrowRightIcon />
        </IconTextButton>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}
