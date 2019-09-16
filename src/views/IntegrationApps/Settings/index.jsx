import {
  Divider,
  ListItem,
  Button,
  Grid,
  Drawer,
  List,
  Chip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import actions from '../../../actions';
import loadable from '../../../utils/loadable';
import * as selectors from '../../../reducers';
import MaterialUiSelect from '../../../components/DynaForm/fields/DynaSelect';
import LoadResources from '../../../components/LoadResources';
import getRoutePath from '../../../utils/routePaths';

const Flows = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationSettings.Flows' */ '../../IntegrationSettings/Flows'
  )
);
const Users = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationSettings.Users' */ '../../IntegrationSettings/Users'
  )
);
const AuditLog = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationSettings.AuditLog' */ '../../IntegrationSettings/AuditLog'
  )
);
const Uninstall = loadable(() =>
  import(/* webpackChunkName: 'IntegrationSettings.Uninstall' */ './Uninstall')
);
/* webpackChunkName: 'IntegrationSettings.AccessTokens' */
const Connections = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationSettings.Connections' */ '../../IntegrationSettings/Connections'
  )
);
const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  appFrame: {
    padding: theme.spacing(1),
  },
  about: {
    padding: theme.spacing(1),
    display: 'inline-flex',
  },
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'flex-start',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(1),
    minHeight: 500,
  },
  rightElement: {
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  activeLink: {
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginTop: '20px',
  },
  storeContainer: {
    display: 'flex',
    background: '#F8FAFF',
    borderBottom: '1px solid #D6E4ED',
    borderTop: 'solid 1px #fff',
  },
  addStore: {
    float: 'right',
  },
  storeSelect: {
    float: 'left',
  },
  tag: {
    marginLeft: theme.spacing(1),
  },
}));

export default function IntegrationAppSettings(props) {
  const { integrationId } = props.match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId)
  );
  const [currentStore, setCurrentStore] = useState(defaultStoreId);
  const showAPITokens = permissions.accesstokens.view;

  useEffect(() => {
    if (!integration) {
      dispatch(actions.resource.request('integrations', integrationId));
    }
  });
  useEffect(() => {
    if (
      (defaultStoreId !== currentStore &&
        !integration.stores.find(s => s.value === currentStore)) ||
      !currentStore
    )
      setCurrentStore(defaultStoreId);
  }, [currentStore, defaultStoreId, integration.stores]);

  const handleStoreChange = (id, value) => {
    setCurrentStore(value);
  };

  const handleTagClickHandler = e => {
    e.preventDefault();
  };

  return (
    <LoadResources required resources="integrations">
      <div className={classes.appFrame}>
        <div className={classes.about}>
          <Typography variant="h5">{integration.name}</Typography>
          <Chip
            label={integration.tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onClick={handleTagClickHandler}
          />
        </div>
        <Divider />
        <div className={classes.storeContainer}>
          <Grid container>
            <Grid item xs={2} className={classes.storeSelect}>
              <MaterialUiSelect
                {...currentStore}
                onFieldChange={handleStoreChange}
                classes={classes}
                defaultValue={currentStore}
                options={[{ items: integration.stores || [] }]}
              />
            </Grid>
            <Grid item xs={10} className={classes.addStore}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}>
                Add {integration.settings.storeLabel}
              </Button>
            </Grid>
          </Grid>
        </div>
        <div className={classes.root}>
          <div className={classes.flex}>
            <Drawer
              variant="permanent"
              anchor="left"
              classes={{
                paper: classes.leftElement,
              }}>
              <List>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="general">
                    General
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="flows">
                    Integration Flows
                  </NavLink>
                </ListItem>
                {showAPITokens && (
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="tokens">
                      API Tokens
                    </NavLink>
                  </ListItem>
                )}
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="connections">
                    Connections
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="users">
                    Users
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="audit">
                    Audit Log
                  </NavLink>
                </ListItem>
                <ListItem>
                  {integration._connectorId && (
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="uninstall">
                      Uninstall
                    </NavLink>
                  )}
                </ListItem>
              </List>
            </Drawer>
          </div>
          <div className={classes.rightElement}>
            <Switch>
              <Route
                path={getRoutePath(`/connectors/:integrationId/settings/flows`)}
                component={Flows}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/connections`
                )}
                component={Connections}
              />
              <Route
                path={getRoutePath(`/connectors/:integrationId/settings/users`)}
                component={Users}
              />
              <Route
                path={getRoutePath(`/connectors/:integrationId/settings/audit`)}
                component={AuditLog}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/uninstall`
                )}
                render={props => (
                  <Uninstall
                    {...props}
                    storeId={currentStore}
                    integrationId={integrationId}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </LoadResources>
  );
}
