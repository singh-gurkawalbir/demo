import React, { useMemo, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import themeProvider from '../theme/themeProvider';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import FontStager from '../components/FontStager';
import AlertDialog from '../components/AlertDialog';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';
import ConflictAlertDialog from '../components/ConflictAlertDialog';
import { selectors } from '../reducers';
import actions from '../actions';
import Signin from '../views/SignIn';
import * as gainsight from '../utils/analytics/gainsight';
import { getDomain } from '../utils/resource';
import getRoutePath from '../utils/routePaths';
import colors from '../theme/colors';
import AppErroredModal from './AppErroredModal';
import WithAuth from './AppRoutingWithAuth';
import CrashReporter from './CrashReporter';
import LoadingNotification from './LoadingNotification';
import ErrorNotifications from './ErrorNotifications';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';

// The makeStyles function below does not have access to the theme.
// We can only use the theme in components that are children of
// <MuiThemeProvider>. That component is what injects the theme into
// the child component context.
const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const useSnackbarStyles = makeStyles({
  variantInfo: {
    backgroundColor: colors.celigoWhite,
    '&:before': {
      background: colors.celigoAccent2,
    },
    '& div > span > svg': {
      color: colors.celigoAccent2,
    },
  },
  variantSuccess: {
    backgroundColor: colors.celigoWhite,
    '&:before': {
      background: colors.celigoSuccess,
    },
    '& div > span > svg': {
      color: colors.celigoSuccess,
    },
  },
  variantWarning: {
    backgroundColor: colors.celigoWhite,
    '&:before': {
      background: colors.celigoWarning,
    },
    '& div > span > svg': {
      color: colors.celigoWarning,
    },
  },
  variantError: {
    backgroundColor: colors.celigoWhite,
    '&:before': {
      background: colors.celigoError,
    },
    '& div > span > svg': {
      color: colors.celigoError,
    },
    '& .MuiSnackbarContent-message': {
      gridTemplateColumns: 'auto, 1fr',
    },
  },
  message: {
    marginLeft: 30,
    overflow: 'auto',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    maxHeight: 300,
    '& > svg': {
      position: 'fixed',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },

});

function NonSigninHeaderComponents(props) {
  return (
    <>
      <CeligoAppBar {...props} />
      <AppErroredModal {...props} />
      <AlertDialog {...props} />
      <CeligoDrawer {...props} />
    </>
  );
}

export const PageContentComponents = () => (
  <Switch>
    <Route path={getRoutePath('/signin')} component={Signin} />
    <Route path={[getRoutePath('/*'), getRoutePath('/')]} component={PageContent} />
  </Switch>
);

export default function App() {
  const classes = useStyles();
  const snackbarClasses = useSnackbarStyles();
  const dispatch = useDispatch();
  const reloadCount = useSelector(state => selectors.reloadCount(state));
  const themeName = useSelector(state =>
    selectors.userPreferences(state).environment === 'sandbox'
      ? 'sandbox'
      : 'light'
  );
  const theme = useMemo(() => themeProvider(themeName), [themeName]);
  const toggleDebugMode = useCallback(() => {
    dispatch(actions.user.toggleDebug());
  }, [dispatch]);

  useKeyboardShortcut(['Shift', 'Control', 'D'], toggleDebugMode);
  // eslint-disable-next-line
  // console.log('render: <App>', reloadCount);

  useEffect(() => {
    const domain = getDomain();

    /**
     * We need to initialize gainsight here for localhost.io only.
     * We are injecting this initialization script into index.html from
     * backend for other domains as per the gainsight support's suggestion
     * for their "Product Mapper" to work properly.
     */
    if (domain === 'localhost.io') {
      gainsight.initialize({ tagKey: 'AP-CAGNPCDUT5BV-2' });
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CrashReporter>
        {/* the provider has to be pushed out because of new instance html5 instance */}
        <DndProvider backend={HTML5Backend}>
          <Fragment key={reloadCount}>
            <ConfirmDialogProvider>
              <SnackbarProvider classes={snackbarClasses} maxSnack={3}>
                <FontStager />
                <CssBaseline />
                <BrowserRouter>
                  <div className={classes.root}>
                    <LoadingNotification />
                    <ErrorNotifications />
                    {/* Headers */}
                    <Switch>
                      <Route path={getRoutePath('/signin')} component={null} />
                      <Route path={getRoutePath('/*')} component={NonSigninHeaderComponents} />
                    </Switch>
                    {/* page content */}
                    <WithAuth>
                      <PageContentComponents />
                    </WithAuth>
                  </div>
                </BrowserRouter>
                <ConflictAlertDialog />
              </SnackbarProvider>
            </ConfirmDialogProvider>
          </Fragment>
        </DndProvider>
      </CrashReporter>
    </MuiThemeProvider>
  );
}
