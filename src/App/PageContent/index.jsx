import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { selectors } from '../../reducers';
import AppRouting from '../AppRouting';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { message } from '../../utils/messageStore';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import useScript from '../../hooks/useScript';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    overflowX: 'auto',
    height: '100vh',
  },
  toolbar: {
    height: theme.appBarHeight,
  },
}));

const scriptUrl = process.env.ZD_CHATBOT_URL + process.env.ZD_CHATBOT_KEY;
const scriptId = 'ze-snippet';

export default function PageContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const isNoneTierLicense = useSelector(state => selectors.platformLicenseWithMetadata(state).isNone);
  const isDefaultAccountSet = useSelector(selectors.isDefaultAccountSet);
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const agreeTOSAndPPRequired = useSelector(selectors.agreeTOSAndPPRequired);
  const environment = useSelector(state => selectors.userPreferences(state)?.environment);
  const isSandboxAllowed = useSelector(selectors.accountHasSandbox);
  const isAccountSwitchInProgress = useSelector(state => selectors.isAccountSwitchInProgress(state));
  const { email, name } = useSelector(state => selectors.userProfile(state), shallowEqual) || {};

  useScript(scriptUrl, scriptId, agreeTOSAndPPRequired, () => {
    // Hiding the default launcher
    window.zE('webWidget', 'hide');

    // Closing the chatbot shows the default launcher, hence hiding the default launcher
    window.zE('webWidget:on', 'close', () => {
      window.zE('webWidget', 'hide');
    });

    // Prefilling values on ticket form
    window.zE('webWidget', 'prefill', {
      email: {
        value: email,
      },
      name: {
        value: name,
      },
    });
  });

  const [enqueueSnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    // Setting the position of the chatbot window
    window.zESettings = {
      webWidget: {
        offset: {
          horizontal: '46px',
          vertical: '46px',
        },
      },
    };

    if (!isNoneTierLicense) return;
    enqueueSnackbar({
      message: message.NONE_TIER_USER_ERROR,
      variant: 'error',
      persist: true,
    });
  }, [enqueueSnackbar, isNoneTierLicense]);

  useEffect(() => {
    // If the Sandbox license got cancelled but the current environment is Sandbox,
    // then redirecting to Production
    if (isDefaultAccountSet && !isSandboxAllowed && (environment === 'sandbox')) {
      dispatch(actions.user.preferences.update({ environment: 'production' }));
      history.push(getRoutePath('/'));
    }
  }, [isDefaultAccountSet, environment, isSandboxAllowed, dispatch, history]);

  if (isNoneTierLicense) return null;
  if ((!isDefaultAccountSet && !isMFASetupIncomplete) || isAccountSwitchInProgress) {
    return <Loader open>Loading...<Spinner /></Loader>;
  }

  return (
    <main className={classes.content}>
      <div
        // This empty div is used to push the scrollable
        // page content below the app/page bars.
        className={clsx({[classes.toolbar]: !agreeTOSAndPPRequired })}
      />
      <AppRouting />
    </main>
  );
}
