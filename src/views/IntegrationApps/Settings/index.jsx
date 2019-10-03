import {
  Divider,
  ListItem,
  Button,
  Grid,
  Drawer,
  List,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import MaterialUiSelect from '../../../components/DynaForm/fields/DynaSelect';
import LoadResources from '../../../components/LoadResources';
import ChipInput from '../../../components/ChipInput';
import Flows from './Flows';
import Users from '../../IntegrationSettings/Users';
import AuditLog from '../../IntegrationSettings/AuditLog';
import Uninstall from './Uninstall';
import Connections from '../../IntegrationSettings/Connections';
import getRoutePath from '../../../utils/routePaths';

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
    zIndex: 1,
  },
  rightElement: {
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(1),
  },

  activeLink: {
    fontWeight: 'bold',
  },
  subSection: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
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
  const [redirected, setRedirected] = useState(false);
  const dispatch = useDispatch();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const connectorFlowSections = useSelector(state =>
    selectors.connectorFlowSections(state, integrationId)
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
    if (integration.settings.supportsMultiStore && !redirected) {
      props.history.push(
        `/pg/connectors/${integrationId}/settings/${currentStore}/flows`
      );
      setRedirected(true);
    }
  }, [
    integration.settings.supportsMultiStore,
    redirected,
    props.history,
    integrationId,
    currentStore,
  ]);

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
    props.history.push(
      `/pg/connectors/${integrationId}/settings/${currentStore}/flows`
    );
  };

  const handleAddNewStoreClick = () => {
    props.history.push(`/pg/connectors/${integrationId}/install/addNewStore`);
  };

  const handleTagChangeHandler = tag => {
    const patchSet = [{ op: 'replace', path: '/tag', value: tag }];

    dispatch(
      actions.resource.patch('integrations', integrationId, patchSet, {
        doNotRefetch: true,
      })
    );
  };

  return (
    <LoadResources
      required
      resources="integrations, exports, imports, flows, connections">
      <div className={classes.appFrame}>
        <div className={classes.about}>
          <Typography variant="h5">{integration.name}</Typography>
          <ChipInput
            value={integration.tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onChange={handleTagChangeHandler}
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
                onClick={handleAddNewStoreClick}
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
                    to={`/pg/connectors/${integrationId}/settings/general`}>
                    General
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/${currentStore}/flows`}>
                    Integration Flows
                  </NavLink>
                </ListItem>
                {connectorFlowSections &&
                  connectorFlowSections.map(f => (
                    <ListItem key={`${f.title}`}>
                      <NavLink
                        activeClassName={classes.subSection}
                        className={classes.link}
                        to={`/pg/connectors/${integrationId}/settings/${currentStore}/${f.title}`}>
                        {f.title}
                      </NavLink>
                    </ListItem>
                  ))}
                {showAPITokens && (
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to={`/pg/connectors/${integrationId}/settings/tokens`}>
                      API Tokens
                    </NavLink>
                  </ListItem>
                )}
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/connections`}>
                    Connections
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/users`}>
                    Users
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/audit`}>
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
                path={getRoutePath(
                  `/connectors/:integrationId/settings/connections`
                )}
                component={Connections}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/:storeId/:section`
                )}
                component={Flows}
              />
              <Route path={`${props.match.url}/users`} component={Users} />
              <Route path={`${props.match.url}/audit`} component={AuditLog} />
              <Route
                path={`${props.match.url}/uninstall`}
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
