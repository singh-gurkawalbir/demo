import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import ResetPasswordForm from './resetPasswordForm';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import useQuery from '../../hooks/useQuery';
import ConcurResetPasswordPage from './Concur';
import { selectors } from '../../reducers';
import actions from '../../actions';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
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
  alertMsg: {
    paddingTop: 20,
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(-2),
    marginBottom: 0,
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  resetPasswordWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  resetPasswordContent: {
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
    fontSize: 30,
    lineHeight: '40px',
  },
  resetPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
}));

function ResetPassword(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, []);
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  return (
    <div className={classes.wrapper}>
      <div className={classes.resetPasswordWrapper}>
        <div className={classes.resetPasswordContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h3" className={classes.title}>
            Reset Password
          </Typography>
          {!isActiveSession ? (
            <ResetPasswordForm
              {...props}
              dialogOpen={false}
              className={classes.resetPasswordForm}
          />
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

export default function RequestResetWrapper(props) {
  const query = useQuery();
  const application = query.get('application');
  let ResetPasswordPage = ResetPassword;

  if (application) {
    switch (application) {
      case 'concur':
        ResetPasswordPage = ConcurResetPasswordPage;
        break;
      default:
        break;
    }
  }

  return <ResetPasswordPage {...props} />;
}
