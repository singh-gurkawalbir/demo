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
import GeneralSection from './GeneralSection';
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

function LHSItem(props) {
  const classes = useStyles();
  const { to, label } = props;

  return (
    <ListItem className={classes.listItem}>
      <NavLink
        activeClassName={classes.activeLink}
        className={classes.link}
        to={to}>
        {label}
      </NavLink>
    </ListItem>
  );
}

export default function IntegrationAppSettings(props) {
  const { integrationId, storeId, section } = props.match.params;
  const classes = useStyles();
  const [redirected, setRedirected] = useState(false);
  const dispatch = useDispatch();
  const urlPrefix = getRoutePath(`connectors/${integrationId}/settings`);
  const permissions = useSelector(state => selectors.userPermissions(state));
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const { supportsMultiStore, hasGeneralSettings, storeLabel } =
    integration.settings || {};
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
          `${`${urlPrefix}/${currentStore}/${connectorFlowSections[0].titleId}`}`
        );
      } else {
        props.history.push(`${urlPrefix}/${connectorFlowSections[0].titleId}`);
      }

      setStoreChanged(false);
      setRedirected(true);
    }
  }, [
    connectorFlowSections,
    currentStore,
    integrationId,
    props.history,
    redirected,
    section,
    storeChanged,
    supportsMultiStore,
    urlPrefix,
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
    props.history.push(
      getRoutePath(`connectors/${integrationId}/install/addNewStore`)
    );
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
                  <LHSItem to={`${urlPrefix}/general`} label="General" />
                )}
                <ListItem className={classes.listItem}>
                  Integration Flows
                  <ul>
                    {connectorFlowSections &&
                      connectorFlowSections.map(f => (
                        <ListItem key={`${f.titleId}`}>
                          <NavLink
                            activeClassName={classes.subSection}
                            className={classes.link}
                            to={
                              supportsMultiStore
                                ? `${urlPrefix}/${currentStore}/${f.titleId}`
                                : `${urlPrefix}/${f.titleId}`
                            }>
                            {f.title}
                          </NavLink>
                        </ListItem>
                      ))}
                  </ul>
                </ListItem>
                {showAPITokens && (
                  <LHSItem to={`${urlPrefix}/tokens`} label="API Tokens" />
                )}
                <LHSItem to={`${urlPrefix}/connections`} label="Connections" />
                <LHSItem to={`${urlPrefix}/users`} label="Users" />
                <LHSItem to={`${urlPrefix}/audit`} label="Audit Log" />
                <LHSItem to={`${urlPrefix}/uninstall`} label="Uninstall" />
              </List>
            </Drawer>
          </div>
          <div className={classes.rightElement}>
            <Switch>
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/general`
                )}
                component={GeneralSection}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/connections`
                )}
                render={props => (
                  <Connections {...props} store={currentStore} />
                )}
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
                path={getRoutePath(`connectors/:integrationId/settings/users`)}
                component={Users}
              />
              <Route
                path={getRoutePath('connectors/:integrationId/settings/audit')}
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
