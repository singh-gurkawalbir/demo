import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { selectors } from '../../reducers';
import AppRouting from '../AppRouting';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { NONE_TIER_USER_ERROR } from '../../utils/messageStore';
import ChatbotWidget from '../../components/ChatbotWidget';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';

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
  const isNoneTierLicense = useSelector(state => selectors.platformLicenseWithMetadata(state).isNone);
  const isDefaultAccountSet = useSelector(selectors.isDefaultAccountSet);
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const agreeTOSAndPPRequired = useSelector(selectors.agreeTOSAndPPRequired);

  const [enqueueSnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (!isNoneTierLicense) return;
    enqueueSnackbar({
      message: NONE_TIER_USER_ERROR,
      variant: 'error',
      persist: true,
    });
  }, [enqueueSnackbar, isNoneTierLicense]);
  if (isNoneTierLicense) return null;
  if (!isDefaultAccountSet && !isMFASetupIncomplete) {
    return <Loader open>Loading...<Spinner /></Loader>;
  }

  return (
    <main className={classes.content}>
      <div
        // This empty div is used to push the scrollable
        // page content below the app/page bars.
        className={clsx({[classes.toolbar]: !agreeTOSAndPPRequired })}
      />
      <ChatbotWidget />
      <AppRouting />
    </main>
  );
}
