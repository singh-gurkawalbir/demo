import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import ApplicationImg from '../../../../icons/ApplicationImg';
import applications from '../../../../../constants/applications';
import CloseIcon from '../../../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  root: {
    width: 150,
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 50,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(0, 1, 0, 2),
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    // maxWidth: theme.spacing(14),
    maxHeight: theme.spacing(5) - 2,
  },
}));

export default function AppPill({ appId }) {
  const classes = useStyles();
  const app = applications.find(a => a.id === appId);

  return (
    <div className={classes.root}>
      <div className={classes.logoContainer}>
        <ApplicationImg
          size="large"
          className={classes.logo}
          type={app.type}
          assistant={app.icon || app.assistant}
        />
      </div>
      <IconButton size="small">
        <CloseIcon />
      </IconButton>
    </div>
  );
}
