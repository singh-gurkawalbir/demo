import React, {
  Fragment,
  useEffect,
  useCallback,
  StrictMode,
  useMemo,
} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppShell } from '@celigo/fuse-ui';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import FontStager from '../components/FontStager';
import AlertDialog from '../components/AlertDialog';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';
import ConflictAlertDialog from '../components/ConflictAlertDialog';
import { selectors } from '../reducers';
import actions from '../actions';
import MfaVerify from '../views/MFA';
import Signin from '../views/SignIn';
import Signup from '../views/SignUp';
import ResetPassword from '../views/ResetRequest';
import ChangeEmail from '../views/ChangeEmail';
import SetPassword from '../views/SetPassword';
import ForgotPassword from '../views/ForgotPassword';
import AcceptInvite from '../views/AcceptInvite';
import * as gainsight from '../utils/analytics/gainsight';
import { getDomain } from '../utils/resource';
import getRoutePath from '../utils/routePaths';
import AppErroredModal from './AppErroredModal';
import WithAuth from './AppRoutingWithAuth';
import CrashReporter from './CrashReporter';
import ShopifyError from '../views/LandingPages/Shopify/Error';
import LoadingNotification from './LoadingNotification';
import ErrorNotifications from './ErrorNotifications';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';
import { FormOnCancelProvider } from '../components/FormOnCancelContext';
import UserActivityMonitor from './UserActivityMonitor';
import * as pendo from '../utils/analytics/pendo';
import MfaHelp from '../views/MFAHelp';
import ConcurConnect from '../views/ConcurConnect';
import Spinner from '../components/Spinner';
import Loader from '../components/Loader';

// The makeStyles function below does not have access to the theme.
// We can only use the theme in components that are children of
// <MuiThemeProvider>. That component is what injects the theme into
// the child component context.
const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});

function NonSigninHeaderComponents() {
  const isAuthInitialized = useSelector(selectors.isAuthInitialized);
  const isUserAuthenticated = useSelector(
    state => selectors.sessionInfo(state)?.authenticated
  );

  if (!isAuthInitialized && !isUserAuthenticated) {
    return (
      <Loader open>
        Loading...
        <Spinner />
      </Loader>
    );
  }

  return (
    <>
      <CeligoAppBar />
      <AppErroredModal />
      <AlertDialog />
      <UserActivityMonitor />
      <CeligoDrawer />
    </>
  );
}
const PUBLIC_ROUTES = [
  'reset-password',
  'change-email',
  'set-initial-password',
  'accept-invite',
  'request-reset-sent',
  'request-reset',
  'signin',
  'signup',
  'mfa',
  'shopify',
];

const pageContentPaths = [getRoutePath('/*'), getRoutePath('/')];
export const PageContentComponents = () => (
  <Switch>
    <Route
      exact
      path={getRoutePath('/reset-password/:token')}
      component={ResetPassword}
    />
    <Route
      exact
      path={getRoutePath('/change-email/:token')}
      component={ChangeEmail}
    />
    <Route
      exact
      path={getRoutePath('/set-initial-password/:token')}
      component={SetPassword}
    />
    <Route path={getRoutePath('/mfa/help')} component={MfaHelp} />
    <Route path={getRoutePath('/mfa/verify')} component={MfaVerify} />
    <Route path={getRoutePath('/signin')} component={Signin} />
    <Route path={getRoutePath('/signup')} component={Signup} />
    <Route
      path={[
        getRoutePath('/request-reset?email'),
        getRoutePath('/request-reset'),
      ]}
      component={ForgotPassword}
    />
    <Route path={getRoutePath('/shopify/error')} component={ShopifyError} />
    <Route
      path={getRoutePath('/request-reset-sent')}
      component={ForgotPassword}
    />
    <Route
      path={getRoutePath('/accept-invite/:token')}
      component={AcceptInvite}
    />
    <Route
      path={getRoutePath('/concurconnect/:module')}
      component={ConcurConnect}
    />
    <Route path={pageContentPaths} component={PageContent} />
  </Switch>
);

const Headers = () => {
  const location = useLocation();

  const isConcurLandingPage = location.pathname.startsWith('/concurconnect');
  const isMFAVerifyPage = location.pathname === '/mfa/verify';
  const isPublicPage = PUBLIC_ROUTES.includes(
    location.pathname?.split('/')?.[1]
  );
  const isLandingPage = location.pathname.startsWith('/landing');
  const isAgreeTOSAndPPPage = location.pathname.startsWith('/agreeTOSAndPP');

  if (
    isConcurLandingPage ||
    isPublicPage ||
    isMFAVerifyPage ||
    isLandingPage ||
    isAgreeTOSAndPPPage
  ) {
    return null;
  }

  return <NonSigninHeaderComponents />;
};

const PageContentWrapper = () => {
  const location = useLocation();
  const isPublicPage = PUBLIC_ROUTES.includes(
    location.pathname?.split('/')?.[1]
  );
  const isSignInPage = location.pathname.startsWith('/signin');

  return isPublicPage && !isSignInPage ? (
    <PageContentComponents />
  ) : (
    <WithAuth>
      <PageContentComponents />
    </WithAuth>
  );
};

export default function App() {
  const env = process.env.NODE_ENV;
  const classes = useStyles();
  const dispatch = useDispatch();
  const reloadCount = useSelector(state => selectors.reloadCount(state));
  const preferences = useSelector(
    state => selectors.userProfilePreferencesProps(state),
    shallowEqual
  );
  const {
    colorTheme: currentTheme,
    timezone,
    timeFormat,
    dateFormat,
    showRelativeDateTime,
  } = preferences;
  const isSandbox = useSelector(
    state => selectors.userPreferences(state).environment === 'sandbox'
  );

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
    if (domain === 'localhost.io' && !process.env.DISABLE_TRACKING_IN_LOCAL) {
      gainsight.initialize({ tagKey: 'AP-CAGNPCDUT5BV-2' });
      pendo.init({ apiKey: '78f58e2a-2645-49fb-70cf-0fc21baff71f' });
    }
  }, []);

  const AppRenderer = () =>
    env !== 'development' ? (
      <div className={classes.root}>
        <LoadingNotification />
        <ErrorNotifications />
        {/* Headers */}
        <Headers />
        {/* page content */}
        <PageContentWrapper />
      </div>
    ) : (
      <StrictMode>
        <div className={classes.root}>
          <LoadingNotification />
          <ErrorNotifications />
          {/* Headers */}
          <Headers />
          {/* page content */}
          <PageContentWrapper />
        </div>
      </StrictMode>
    );

  // Note tht this appContext should be properly cached as any changes
  // to it will cause a full re-render of the app. This is by design,
  // as we DO want any of these prefs to force a re-render of the app.
  const appContext = useMemo(
    () => ({
      // language?: string; // not used yet dummy field
      theme: currentTheme, // "light" | "dark" | "orion";
      isSandbox,
      timezone,
      timeFormat,
      dateFormat,
      showRelativeDateTime,
    }),
    [
      isSandbox,
      currentTheme,
      timezone,
      timeFormat,
      dateFormat,
      showRelativeDateTime,
    ]
  );

  return (
    <StyledEngineProvider injectFirst>
      <AppShell appContext={appContext}>
        <CrashReporter>
          <DndProvider backend={HTML5Backend}>
            <Fragment key={reloadCount}>
              <ConfirmDialogProvider>
                <FormOnCancelProvider>
                  <SnackbarProvider
                    sx={{
                      '& .SnackbarContent-root': {
                        bgcolor: theme => theme.palette.background.paper,
                        color: theme => theme.palette.text.primary,
                        '&:before': {
                          content: '""',
                          width: 5,
                          height: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          borderRadius: '4px 0 0 4px',
                        },
                      },
                      '& .SnackbarItem-variantInfo': {
                        '&:before': {
                          bgcolor: theme => theme.palette.primary.main,
                        },
                        '& div > svg': {
                          color: theme => theme.palette.primary.main,
                        },
                      },
                      '& .SnackbarItem-variantSuccess': {
                        '&:before': {
                          bgcolor: theme => theme.palette.success.main,
                        },
                        '& div > svg': {
                          color: theme => theme.palette.success.main,
                        },
                      },
                      '& .SnackbarItem-variantWarning': {
                        '&:before': {
                          bgcolor: theme => theme.palette.warning.main,
                        },
                        '& div > svg': {
                          color: theme => theme.palette.warning.main,
                        },
                      },
                      '& .SnackbarItem-variantError': {
                        '&:before': {
                          bgcolor: theme => theme.palette.error.main,
                        },
                        '& div > svg': {
                          color: theme => theme.palette.error.main,
                        },
                      },
                      '& .SnackbarItem-message': {
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        wordBreak: 'break-word',
                        paddingTop: '6px',
                      },
                    }}>
                    <FontStager />
                    <CssBaseline />
                    {/* Define empty call back for getUserConfirmation to not let Prompt
                  * get triggered when history.block is defined in any specific component
                  * Ref: https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md
                  */}
                    <BrowserRouter getUserConfirmation={() => {}}>
                      <AppRenderer />
                    </BrowserRouter>
                    <ConflictAlertDialog />
                  </SnackbarProvider>
                </FormOnCancelProvider>
              </ConfirmDialogProvider>
            </Fragment>
          </DndProvider>
        </CrashReporter>
      </AppShell>
    </StyledEngineProvider>
  );
}
