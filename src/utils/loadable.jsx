import { PureComponent } from 'react';
import Loadable from 'react-loadable';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Loader from '../components/Loader';

@withStyles(theme => ({
  view: {
    textAlign: 'center',
    margin: 100,
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    overflowX: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  spinner: {
    color: theme.palette.linkHover,
  },
  errorIcon: {
    fontSize: 48,
  },
}))
class Loading extends PureComponent {
  content() {
    const { classes, error, timedOut, pastDelay } = this.props;

    if (error) {
      throw error;
    } else if (timedOut || pastDelay) {
      return (
        <Loader open>
          <Typography variant="h4">Loading</Typography>
          <CircularProgress
            size={24}
            classes={{
              circleIndeterminate: classes.spinner,
            }}
          />
        </Loader>
      );
    }

    return null;
  }

  render() {
    const { classes } = this.props;

    return <div className={classes.view}>{this.content()}</div>;
  }
}

export default loader =>
  Loadable({
    loader,
    loading: Loading,
  });
