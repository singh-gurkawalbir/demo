import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import HomeIconIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import FontStager from '../components/FontStager';
import Appbar from '../components/Appbar';
import Spinner from '../components/Spinner';
import ErrorPanel from '../components/ErrorPanel';
import theme from '../theme';
import loadable from '../utils/loadable';
import auth from '../utils/auth';
import api from '../utils/api';
import { ListItem } from '../../node_modules/@material-ui/core';

const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard')
);
const Pipelines = loadable(() =>
  import(/* webpackChunkName: 'Pipelines' */ '../views/Pipelines')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../views/NotFound')
);
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../views/lists/Exports')
);
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../views/lists/Imports')
);

@hot(module)
@withStyles({
  appBar: {},
})
export default class App extends Component {
  state = {
    loading: false,
    showDrawer: false,
    authenticated: false,
    profile: null,
    exports: null,
    imports: null,
    connections: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        authenticated: await this.setAuthCookie(),
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }

    const self = this;

    // lazy load app state. each view must handle case
    // where necessary app state is still loading...
    // we still want users to navigate the site even which we
    // prime the caches...
    // console.log('loading exports');

    /* Profile Returns:
    { agreeTOSAndPP: true
      auth_type_google:
        { email: "dave.riedl@celigo.com", id: "long int"}
          company:"Celigo"
        },
      _id: "uuid",
      createdAt: "2018-07-03T21:06:50.926Z",
      developer: true,
      email: "dave.riedl@celigo.com",
      emailHash: "xxx",
      name: "Dave Riedl",
      phone: "402",
      role: "Dev",
      timezone: "America/Los_Angeles",
    }
    */
    api('/profile').then(profile => {
      if (profile) {
        const avatarUrl = `https://secure.gravatar.com/avatar/${
          profile.emailHash
        }?d=mm&s=55`;
        const enhanced = { ...profile, avatarUrl };

        // console.log('profile enhanced:', enhanced);

        self.setState({ profile: enhanced });
      } else {
        self.setState({ profile: null });
      }
    });

    api('/exports').then(exports => {
      // console.log('exports loaded');
      self.setState({ exports: exports || [] });
    });

    api('/imports').then(imports => {
      // console.log('imports loaded');
      self.setState({ imports: imports || [] });
    });

    // console.log('loading connections');
    api('/connections').then(connections => {
      // console.log('connections loaded');
      self.setState({ connections: connections || [] });
    });
  }

  async setAuthCookie() {
    const isSuccess = await auth();

    // console.log(`auth success: ${isSuccess}`);

    return isSuccess;
  }

  handleToggleDrawer = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      error,
      showDrawer,
      profile,
      exports,
      imports,
      connections,
      authenticated,
    } = this.state;

    if (loading) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Authenticating.
          </Typography>
          <Spinner loading />
        </Paper>
      );
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    if (!authenticated) {
      return <ErrorPanel error="Authentication failed!" />;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            <Appbar
              profile={profile}
              onToggleDrawer={this.handleToggleDrawer}
            />

            <Drawer open={showDrawer}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.handleToggleDrawer}
                onKeyDown={this.handleToggleDrawer}>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <HomeIconIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link variant="" to="/pg/">
                        Dashboard
                      </Link>
                    </ListItemText>
                  </ListItem>
                  <ListItem button>
                    <Link to="/pg/exports">
                      <ListItemIcon>
                        <CloudDownloadIcon />
                      </ListItemIcon>
                      <ListItemText>Exports</ListItemText>
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <CloudUploadIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link to="/pg/imports">Imports</Link>
                    </ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <DataUsageIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link to="/pg/pipelines">Create a Data Pipe</Link>
                    </ListItemText>
                  </ListItem>
                </List>
              </div>
            </Drawer>

            <Switch>
              <Route path="/pg/pipelines" component={Pipelines} />
              <Route
                path="/pg/exports"
                render={props => (
                  <Exports
                    {...props}
                    exports={exports}
                    connections={connections}
                  />
                )}
              />
              <Route
                path="/pg/imports"
                render={props => (
                  <Imports
                    {...props}
                    imports={imports}
                    connections={connections}
                  />
                )}
              />
              <Route path="/pg" component={Dashboard} />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
