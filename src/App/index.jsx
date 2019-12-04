import { useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FontStager from '../components/FontStager';
import themeProvider from '../theme/themeProvider';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';
import AuthDialog from '../components/AuthDialog';
import AppErroredModal from './AppErroredModal';
import NetworkSnackbar from '../components/NetworkSnackbar';
import * as selectors from '../reducers';
import WithAuth from './AppRoutingWithAuth';
import Signin from '../views/SignIn';

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
  const reloadCount = useSelector(state => selectors.reloadCount(state));
  const themeName = useSelector(state => selectors.themeName(state));
  const theme = useMemo(() => themeProvider(themeName), [themeName]);

  // eslint-disable-next-line
  // console.log('render: <App>', reloadCount);

  return (
    <MuiThemeProvider key={reloadCount} theme={theme}>
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
    </MuiThemeProvider>
  );
}
