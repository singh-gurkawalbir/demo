import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import AppRouting from '../AppRouting';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { NONE_TIER_USER_ERROR } from '../../utils/messageStore';
import ChatbotWidget from '../../components/ChatbotWidget';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

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

export default function PageContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const isNoneTierLicense = useSelector(state => selectors.platformLicenseWithMetadata(state).isNone);
  const isDefaultAccountSet = useSelector(selectors.isDefaultAccountSet);
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const environment = useSelector(state => selectors.userPreferences(state)?.environment);
  const isSandboxAllowed = useSelector(selectors.accountHasSandbox);

  const [enqueueSnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (!isNoneTierLicense) return;
    enqueueSnackbar({
      message: NONE_TIER_USER_ERROR,
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
  if (!isDefaultAccountSet && !isMFASetupIncomplete) {
    return <Loader open>Loading...<Spinner /></Loader>;
  }

  return (
    <main className={classes.content}>
      <div
        className={
          // This empty div is used to push the scrollable
          // page content below the app/page bars.
          classes.toolbar
        }
      />
      <ChatbotWidget />
      <AppRouting />
    </main>
  );
}
