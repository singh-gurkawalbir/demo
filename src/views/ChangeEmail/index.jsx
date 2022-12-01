import React, { useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import { selectors } from '../../reducers';
import actions from '../../actions';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import { CHANGE_EMAIL_SUCCESS } from '../../constants';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  marketingContentWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  changeEmailWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  changeEmailContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
    marginTop: '50%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: 20,
    lineHeight: '40px',
  },
  setPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
}));
export default function ChangeEmail(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const changeEmailStatus = useSelector(state => selectors.changeEmailStatus(state));
  const token = React.useState(props.match.params.token ? props.match.params.token : '');

  useEffect(() => {
    if (token == null || token === '') {
      return;
    }
    dispatch(actions.auth.changeEmailRequest(token));
  }, [dispatch, token]);
  useEffect(() => {
    if (changeEmailStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', CHANGE_EMAIL_SUCCESS));
      history.replace(getRoutePath('/signin?from=change=email'));
    }
  }, [dispatch, history, changeEmailStatus]);

  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  if (changeEmailStatus === '') {
    // return (
    //   <Spinner centerAll />
    // );
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.changeEmailWrapper}>
        <div className={classes.changeEmailContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h1" className={classes.title}>
            Failed to change email address.
          </Typography>
          <Typography variant="body1">
            invalid token
          </Typography>
        </div>
      </div>
      <div className={classes.marketingContentWrapper}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
