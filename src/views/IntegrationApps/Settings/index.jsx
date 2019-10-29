import {
  Divider,
  ListItem,
  Button,
  Grid,
  Drawer,
  List,
} from '@material-ui/core';
import { isEmpty } from 'lodash';
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
import AccessTokens from './AccessTokens';
import getRoutePath from '../../../utils/routePaths';
import CeligoPageBar from '../../../components/CeligoPageBar';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'flex-start',
    overflowX: 'auto',
    minHeight: '81vh',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(1),
    minHeight: 500,
    zIndex: 0,
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
    marginTop: 10,
  },
  storeContainer: {
    display: 'flex',
    margin: theme.spacing(1, 3),
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
  const integrationAppFlowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, currentStore)
  );
  const showAPITokens = permissions.accesstokens.view;

  useEffect(() => {
    if (!isEmpty(integration)) {
      if (!integration.mode || integration.mode === 'install') {
        props.history.push(getRoutePath(`/connectors/${integrationId}/setup`));
      } else if (integration.mode === 'uninstall') {
        props.history.push(
          getRoutePath(
            `/connectors/${integrationId}/uninstall${
              currentStore ? `/${currentStore}` : ''
            }`
          )
        );
      }
    }
  }, [
    currentStore,
    integration,
    integration.mode,
    integrationId,
    props.history,
  ]);

  useEffect(() => {
    if ((!redirected && (section === 'flows' || !section)) || storeChanged) {
      if (supportsMultiStore) {
        props.history.push(
          `${`${urlPrefix}/${currentStore}/${integrationAppFlowSections[0].titleId}`}`
        );
      } else {
        props.history.push(
          `${urlPrefix}/${integrationAppFlowSections[0].titleId}`
        );
      }

      setStoreChanged(false);
      setRedirected(true);
    }
  }, [
    integrationAppFlowSections,
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
      <div>
        <CeligoPageBar title={integration.name}>
          <ChipInput
            value={integration.tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onChange={handleTagChangeHandler}
          />
          <a
            href={getRoutePath(`integrations/${integrationId}/dashboard`)}
            className={classes.dashboard}>
            Dashboard
          </a>
        </CeligoPageBar>

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
                    {integrationAppFlowSections &&
                      integrationAppFlowSections.map(f => (
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
                render={props => (
                  <GeneralSection {...props} storeId={currentStore} />
                )}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/tokens`
                )}
                render={props => (
                  <AccessTokens
                    {...props}
                    storeId={currentStore}
                    integrationId={integrationId}
                  />
                )}
              />
              <Route
                path={getRoutePath(
                  `/connectors/:integrationId/settings/connections`
                )}
                render={props => (
                  <Connections {...props} storeId={currentStore} />
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
