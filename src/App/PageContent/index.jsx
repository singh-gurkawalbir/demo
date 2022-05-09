import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import AppRouting from '../AppRouting';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { NONE_TIER_USER_ERROR } from '../../utils/messageStore';

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

  return (
    <main className={classes.content}>
      <div
        className={
          // This empty div is used to push the scrollable
          // page content below the app/page bars.
          classes.toolbar
        }
      />
      <AppRouting />
    </main>
  );
}
