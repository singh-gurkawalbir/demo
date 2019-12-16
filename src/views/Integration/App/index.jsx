import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, generatePath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import AddIcon from '../../../components/icons/AddIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import GeneralIcon from '../../../components/icons/SettingsIcon';
import AdminIcon from '../../../components/icons/AdminIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import ChipInput from '../../../components/ChipInput';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import GeneralPanel from './panels/General';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import AddOnsPanel from './panels/AddOns';
import IntegrationTabs from '../common/Tabs';
import getRoutePath from '../../../utils/routePaths';

const allTabs = [
  { path: 'general', label: 'General', Icon: GeneralIcon, Panel: GeneralPanel },
  { path: 'flows', label: 'Flows', Icon: FlowsIcon, Panel: FlowsPanel },
  {
    path: 'dashboard',
    label: 'Dashboard',
    Icon: DashboardIcon,
    Panel: DashboardPanel,
  },
  {
    path: 'connections',
    label: 'Connections',
    Icon: ConnectionsIcon,
    Panel: ConnectionsPanel,
  },
  { path: 'admin', label: 'Admin', Icon: AdminIcon, Panel: AdminPanel },
  { path: 'addons', label: 'Add-ons', Icon: AddIcon, Panel: AddOnsPanel },
];
const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  storeSelect: {
    fontFamily: 'Roboto500',
    fontSize: 13,
    borderRadius: 4,
    backgroundColor: `rgb(0,0,0,0)`,
    transition: theme.transitions.create('background-color'),
    paddingLeft: theme.spacing(1),
    height: 'unset',
    '&:hover': {
      backgroundColor: `rgb(0,0,0,0.05)`,
    },
    '& > div': {
      paddingTop: theme.spacing(1),
    },
  },
}));

export default function IntegrationApp({ match, history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { integrationId, storeId, tab } = match.params;
  // TODO: Note this selector should return undefined/null if no
  // integration exists. not a stubbed out complex object.
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId, storeId)
  );
  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const hideGeneralTab = useSelector(
    state => !selectors.hasGeneralSettings(state, integrationId, storeId)
  );
  //
  //
  // TODO: All the code below should be moved into the data layer.
  // the addonState selector should return a status to indicted if there
  // is a pending request in progress. This would be used to dispatch
  // a request instead of all these useEffects and local state management.
  const [requestLicense, setRequestLicense] = useState(false);
  const [requestMappingMetadata, setRequestMappingMetadata] = useState(false);

  useEffect(() => {
    if (addOnState && !addOnState.addOns && !requestLicense) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
      setRequestLicense(true);
    }
  }, [addOnState, dispatch, integrationId, requestLicense]);

  useEffect(() => {
    if (addOnState && !addOnState.mappingMapping && !requestMappingMetadata) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
      setRequestMappingMetadata(true);
    }
  }, [addOnState, dispatch, integrationId, requestMappingMetadata]);

  const hasAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnMetaData &&
    addOnState.addOns.addOnMetaData.length > 0;
  // All the code ABOVE this comment should be moved from this component to the data-layer.
  //
  //
  let availableTabs = hasAddOns
    ? allTabs
    : // remove addons tab (end) if IA doesn't have any.
      allTabs.slice(0, allTabs.length - 1);

  if (hideGeneralTab) {
    availableTabs = availableTabs.slice(1);
  }

  const handleTagChangeHandler = useCallback(
    tag => {
      const patchSet = [{ op: 'replace', path: '/tag', value: tag }];

      dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('integrations', integrationId, 'value')
      );
    },
    [dispatch, integrationId]
  );
  const handleStoreChange = useCallback(
    e => {
      const newStoreId = e.target.value;

      // Redirect to current tab of new store
      history.push(
        getRoutePath(
          `integrationApp/${integrationId}/child/${newStoreId}/${tab}`
        )
      );
    },
    [history, integrationId, tab]
  );
  const handleAddNewStoreClick = useCallback(() => {
    history.push(`/pg/connectors/${integrationId}/install/addNewStore`);
  }, [history, integrationId]);

  // There is no need for further processing if no integration
  // is returned. Most likely case is that there is a pending IO
  // call for integrations.
  if (!integration || !integration._id) {
    return <LoadResources required resources="integrations" />;
  }

  if (redirectTo) {
    const path = generatePath(match.path, {
      integrationId,
      storeId,
      tab: redirectTo,
    });

    dispatch(actions.integrationApp.settings.clearRedirect(integrationId));
    history.push(path);

    return null;
    // TODO: This approach navigating to the url but not rendering the component.
    // return <Redirect push={false} to={path} />;
  }

  const { supportsMultiStore, storeLabel } = integration.settings || {};

  // To support breadcrumbs, and also to have a more robust url interface,
  // we want to "self-heal" partial urls hitting this page.  If an integration app
  // is routed to this component without a storeId (if it supports multi-store),
  // or if no tab is selected, we rewrite the current url in the history to carry
  // this state information forward.
  if (supportsMultiStore) {
    if (!storeId) {
      return (
        <Redirect
          push={false}
          to={`/pg/integrationApp/${integrationId}/child/${defaultStoreId}/${tab ||
            'flows'}`}
        />
      );
    }
  } else if (!tab) {
    return <Redirect push={false} to={`${match.url}/flows`} />;
  }

  if (tab === 'general' && hideGeneralTab) {
    return (
      <Redirect
        push={false}
        to={
          supportsMultiStore
            ? `/pg/integrationApp/${integrationId}/child/${storeId}/flows`
            : `/pg/integrationApp/${integrationId}/flows`
        }
      />
    );
  }

  // console.log('render: <IntegrationApp>');

  return (
    <Fragment>
      <ResourceDrawer />
      <CeligoPageBar
        title={integration.name}
        titleTag={
          <ChipInput
            value={integration.tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onChange={handleTagChangeHandler}
          />
        }
        infoText={integration.description}>
        {supportsMultiStore && (
          <div className={classes.actions}>
            <IconTextButton
              variant="text"
              data-test={`add${storeLabel}`}
              onClick={handleAddNewStoreClick}>
              <AddIcon /> Add {storeLabel}
            </IconTextButton>
            <Select
              displayEmpty
              data-test={`select${storeLabel}`}
              className={classes.storeSelect}
              onChange={handleStoreChange}
              IconComponent={ArrowDownIcon}
              value={storeId}>
              <MenuItem disabled value="">
                Select {storeLabel}
              </MenuItem>

              {integration.stores.map(s => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </CeligoPageBar>

      <IntegrationTabs tabs={availableTabs} />
    </Fragment>
  );
}
