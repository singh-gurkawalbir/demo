import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import AddIcon from '../../../components/icons/AddIcon';
// TODO: Azhar, please update these next 3 icons, once provided by the product team.
import FlowsIcon from '../../../components/icons/FlowBuilderIcon';
import AdminIcon from '../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../components/icons/AdjustInventoryIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import ChipInput from '../../../components/ChipInput';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import IntegrationTabs from '../common/Tabs';

const tabs = [
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
    transition: theme.transitions.create('border'),
    paddingLeft: theme.spacing(1),
    border: `solid 1px transparent`,
    height: 'unset',
    '&:hover': {
      borderColor: theme.palette.primary.light,
    },
    '& > div': {
      paddingTop: theme.spacing(1) + 1,
    },
  },
}));

export default function IntegrationApp({ match, history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { integrationId, storeId, tab } = match.params;

  console.log(match.params);

  // Note this selector should return undefined/null if no
  // integration exists. not a stubbed out complex object.
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );

  console.log('integration', integration);

  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId, storeId)
  );
  const handleTagChangeHandler = useCallback(
    tag => {
      const patchSet = [{ op: 'replace', path: '/tag', value: tag }];

      dispatch(
        actions.resource.patch('integrations', integrationId, patchSet, {
          doNotRefetch: true, // could this prop be renamed to 'skipFetch'?
        })
      );
    },
    [dispatch, integrationId]
  );
  const handleStoreChange = useCallback(
    e => {
      history.push(
        `/pg/integrationApp/${integrationId}/store/${e.target.value}/flows`
      );
    },
    [history, integrationId]
  );
  const handleAddNewStoreClick = useCallback(() => {
    history.push(`/pg/connectors/${integrationId}/install/addNewStore`);
  }, [history, integrationId]);

  // console.log(integrationId, storeId, tab);

  // There is no need for further processing if no integration
  // is returned. Most likely case is that there is a pending IO
  // call for integrations.
  if (!integration || !integration._id) {
    return <LoadResources required resources="integrations" />;
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
          to={`/pg/integrationApp/${integrationId}/store/${defaultStoreId}/flows`}
        />
      );
    }
  } else if (!tab) {
    return <Redirect push={false} to={`${match.url}/flows`} />;
  }

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <Fragment>
      <ResourceDrawer match={match} />
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
              className={classes.storeSelect}
              onChange={handleStoreChange}
              value="">
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

      <IntegrationTabs tabs={tabs} />
    </Fragment>
  );
}
