import React, { useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import { selectors } from '../../reducers';
import actions from '../../actions';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import getRoutePath from '../../utils/routePaths';
import Spinner from '../../components/Spinner';
import { ACTIVE_SESSION_MESSAGE } from '../../constants';

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
  alertMsg: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 0,
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
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
  const changeEmailMessage = useSelector(state => selectors.changeEmailMessage(state));
  const ChangeEmailErrMessage = useSelector(state => selectors.changeEmailErrorMessage(state));
  const token = React.useState(props.match.params.token ? props.match.params.token : '');
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.changeEmailRequest(token));
    dispatch(actions.auth.validateSession());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (changeEmailStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', changeEmailMessage));
      history.replace(getRoutePath('/signin?from=change=email'));
    }
  }, [dispatch, history, changeEmailStatus, changeEmailMessage]);

  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  if (changeEmailStatus === 'failed') {
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
            {!isActiveSession ? (
              <Typography variant="body1">
                {ChangeEmailErrMessage}
              </Typography>
            ) : (
              <Typography
                data-private
                color="error"
                component="div"
                variant="h5"
                className={classes.alertMsg}>
                {ACTIVE_SESSION_MESSAGE}
              </Typography>
            )}
          </div>
        </div>
        <div className={classes.marketingContentWrapper}>
          <MarketingContentWithIframe contentUrl={contentUrl} />
        </div>
      </div>
    );
  }

  return <Spinner centerAll />;
}
