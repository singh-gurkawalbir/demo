import { useMemo, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import FontStager from '../components/FontStager';
import themeProvider from '../theme/themeProvider';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';
import AuthDialog from '../components/AuthDialog';
import AppErroredModal from './AppErroredModal';
import NetworkSnackbar from '../components/NetworkSnackbar';
import * as selectors from '../reducers';
import actions from '../actions';
import WithAuth from './AppRoutingWithAuth';
import Signin from '../views/SignIn';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';
import ConflictAlertDialog from '../views/Resources/ConflictAlertDialog';

// The makeStyles function below does not have access to the theme.
// We can only use the theme in components that are children of
// <MuiThemeProvider>. That component is what injects the theme into
// the child component context.
const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

function NonSigninHeaderComponents(props) {
  return (
    <Fragment>
      <CeligoAppBar {...props} />
      <AppErroredModal {...props} />
      <AuthDialog {...props} />
      <CeligoDrawer {...props} />
    </Fragment>
  );
}

export const PageContentComponents = () => (
  <Switch>
    <Route path="/pg/signin" component={Signin} />
    <Route path="/pg*" component={PageContent} />
  </Switch>
);

export default function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const reloadCount = useSelector(state => selectors.reloadCount(state));
  const themeName = useSelector(state =>
    selectors.userPreferences(state).environment === 'sandbox'
      ? 'sandbox'
      : 'light'
  );
  const theme = useMemo(() => themeProvider(themeName), [themeName]);
  const toggleDebugMode = useCallback(() => {
    dispatch(actions.user.preferences.toggleDebug());
  }, [dispatch]);

  useKeyboardShortcut(['Shift', 'Control', 'D'], toggleDebugMode);
  // eslint-disable-next-line
  // console.log('render: <App>', reloadCount);

  return (
    <MuiThemeProvider key={reloadCount} theme={theme}>
      <ConfirmDialogProvider>
        <SnackbarProvider maxSnack={3}>
          <FontStager />
          <CssBaseline />
          <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
              <div className={classes.root}>
                <NetworkSnackbar />
                {/* Headers */}
                <Switch>
                  <Route path="/pg/signin" component={null} />
                  <Route path="/pg*" component={NonSigninHeaderComponents} />
                </Switch>
                {/* page content */}
                <WithAuth>
                  <PageContentComponents />
                </WithAuth>
              </div>
            </BrowserRouter>
          </DndProvider>
          <ConflictAlertDialog />
        </SnackbarProvider>
      </ConfirmDialogProvider>
    </MuiThemeProvider>
  );
}
