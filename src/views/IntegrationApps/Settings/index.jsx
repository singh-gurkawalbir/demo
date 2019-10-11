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
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  },
  flex: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginTop: '10px',
  },
  storeContainer: {
    display: 'flex',
    background: theme.palette.background.default,
    borderBottom: `solid 1px ${theme.palette.background.paper}`,
    borderTop: `solid 1px ${theme.palette.background.paper}`,
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
  listItem: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    '& > ul': {
      padding: 0,
    },
  },
}));

export default function IntegrationAppSettings(props) {
  const { integrationId, storeId, section } = props.match.params;
  const classes = useStyles();
  const [redirected, setRedirected] = useState(false);
  const dispatch = useDispatch();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const {
    supportsMultiStore,
    hasGeneralSettings,
    storeLabel,
  } = integration.settings;
  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId, storeId)
  );
  const [currentStore, setCurrentStore] = useState(defaultStoreId);
  const [storeChanged, setStoreChanged] = useState(false);
  const connectorFlowSections = useSelector(state =>
    selectors.connectorFlowSections(state, integrationId, currentStore)
  );
  const showAPITokens = permissions.accesstokens.view;

  useEffect(() => {
    if ((!redirected && section === 'flows') || storeChanged) {
      if (supportsMultiStore) {
        props.history.push(
          `${`/pg/connectors/${integrationId}/settings/${currentStore}/${connectorFlowSections[0].title.replace(
            /\s/g,
            ''
          )}`}`
        );
      } else {
        props.history.push(
          `/pg/connectors/${integrationId}/settings/${connectorFlowSections[0].title.replace(
            /\s/g,
            ''
          )}`
        );
      }

      setRedirected(true);
    }
  }, [
    connectorFlowSections,
    currentStore,
    integrationId,
    props.history,
    props.match.url,
    redirected,
    section,
    storeChanged,
    supportsMultiStore,
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
    setStoreChanged(true);
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
        {supportsMultiStore && (
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
                  data-test={`Add ${storeLabel}`}
                  variant="contained"
                  color="primary"
                  onClick={handleAddNewStoreClick}
                  className={classes.button}>
                  Add {storeLabel}
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        <Divider />
        <div className={classes.root}>
          <div className={classes.flex}>
            <Drawer
              variant="permanent"
              anchor="left"
              classes={{
                paper: classes.leftElement,
              }}>
              <List>
                {hasGeneralSettings && (
                  <ListItem className={classes.listItem}>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to={`/pg/connectors/${integrationId}/settings/general`}>
                      General
                    </NavLink>
                  </ListItem>
                )}
                <ListItem className={classes.listItem}>
                  Integration Flows
                  <ul>
                    {connectorFlowSections &&
                      connectorFlowSections.map(f => (
                        <ListItem key={`${f.title.replace(/ /g, '')}`}>
                          <NavLink
                            activeClassName={classes.subSection}
                            className={classes.link}
                            to={
                              supportsMultiStore
                                ? `/pg/connectors/${integrationId}/settings/${currentStore}/${f.title.replace(
                                    / /g,
                                    ''
                                  )}`
                                : `/pg/connectors/${integrationId}/settings/${f.title.replace(
                                    / /g,
                                    ''
                                  )}`
                            }>
                            {f.title.replace(/ /g, '')}
                          </NavLink>
                        </ListItem>
                      ))}
                  </ul>
                </ListItem>
                {showAPITokens && (
                  <ListItem className={classes.listItem}>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to={`/pg/connectors/${integrationId}/settings/tokens`}>
                      API Tokens
                    </NavLink>
                  </ListItem>
                )}
                <ListItem className={classes.listItem}>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/connections`}>
                    Connections
                  </NavLink>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/users`}>
                    Users
                  </NavLink>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to={`/pg/connectors/${integrationId}/settings/audit`}>
                    Audit Log
                  </NavLink>
                </ListItem>
                <ListItem className={classes.listItem}>
                  {integration._connectorId && (
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to={`/pg/connectors/${integrationId}/settings/uninstall`}>
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
              <Route
                path={`/pg/connectors/${integrationId}/settings/users`}
                component={Users}
              />
              <Route
                path={`/pg/connectors/${integrationId}/settings/audit`}
                component={AuditLog}
              />
              <Route
                path={
                  supportsMultiStore
                    ? getRoutePath(
                        `/connectors/:integrationId/settings/:storeId/:section`
                      )
                    : getRoutePath(
                        `/connectors/:integrationId/settings/:section`
                      )
                }
                component={Flows}
              />
            </Switch>
          </div>
        </div>
      </div>
    </LoadResources>
  );
}
