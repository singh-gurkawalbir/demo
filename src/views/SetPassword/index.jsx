import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import SetPasswordForm from './setPasswordForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';
import { ACTIVE_SESSION_MESSAGE } from '../../constants';
import Spinner from '../../components/Spinner';

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
  setPasswordWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  setPasswordContent: {
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
  setPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
}));
export default function SetPassword(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);
  const sessionInfoResolved = useSelector(selectors.mfaSessionInfoStatus) === 'received';
  const isActiveSession = useSelector(state => selectors.sessionInfo(state)?.authenticated);

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.setPasswordWrapper}>
        <div className={classes.setPasswordContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h3" className={classes.title}>
            Create your password
          </Typography>
          { !sessionInfoResolved ? <Spinner />
            : (
              <div>
                {!isActiveSession ? (
                  <SetPasswordForm
                    {...props}
                    dialogOpen={false}
                    className={classes.setPasswordForm}
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
            )}
        </div>
      </div>
      <div className={classes.marketingContentWrapper}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
