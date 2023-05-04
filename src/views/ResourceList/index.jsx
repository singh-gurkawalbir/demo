import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import AddIcon from '../../components/icons/AddIcon';
import CeligoPageBar from '../../components/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL, generateNewId,
  isTradingPartnerSupported,
  convertResourceLabelToLowercase,
} from '../../utils/resource';
import infoText from './infoText';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../constants';
import { additionalFilter } from './util';
import actions from '../../actions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import StackShareDrawer from '../../components/StackShare/Drawer';
import ConfigConnectionDebugger from '../../components/drawer/ConfigConnectionDebugger';
import ScriptLogsDrawerRoute from '../ScriptLogs/Drawer';
import { TextButton } from '../../components/Buttons';
import ResourceTableWrapper from '../../components/ResourceTableWrapper';
import ActionGroup from '../../components/ActionGroup';
import PageContent from '../../components/PageContent';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import LoadingNotification from '../../App/LoadingNotification';

const defaultFilter = { take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10 };
const resourcesToLoad = resourceType => {
  if (resourceType === 'exports' || resourceType === 'imports') {
    // add connections
    return `${resourceType},connections`;
  }
  if (resourceType === 'apis') {
    return `${resourceType},scripts`;
  }

  return resourceType;
};

const createdResouceLabelFn = (resourceType, resourceName) => {
  let createResourceLabel = '';

  if (resourceType) {
    if (['accesstokens', 'apis', 'connectors'].includes(resourceType)) {
      createResourceLabel = resourceName;
    } else {
      createResourceLabel = convertResourceLabelToLowercase(resourceName);
    }
  }

  return createResourceLabel;
};

const spinner = <LoadingNotification message="Loading" />;

export default function ResourceList(props) {
  const location = useLocation();
  const match = useRouteMatch();
  const { resourceType } = match.params;
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, resourceType));
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      filter: additionalFilter(resourceType),
      ...(filter || {}),
    }),
    [filter, resourceType]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );

  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const showTradingPartner = isTradingPartnerSupported({licenseActionDetails, accessLevel, environment});
  const resourceName = MODEL_PLURAL_TO_LABEL[resourceType] || '';

  const createResourceLabel = createdResouceLabelFn(resourceType, resourceName);

  useEffect(() => {
    let filter = defaultFilter;

    if (resourceType === 'connectors') {
      filter = {...filter, sort: { orderBy: 'name', order: 'asc' }};
    }
    dispatch(actions.patchFilter(resourceType, filter));

    // we clear the sort during unmounts this it to prevent the same filter state getting forwarded to the sandbox env
    return () => dispatch(actions.clearFilter(resourceType));
  },
  [dispatch, resourceType]);

  useEffect(() => {
    dispatch(actions.resource.connections.refreshStatus());

    // TODO: discus with team how to best handle this feature (and as future feature pattern)...
    // This works file for this single connection list, but what about other places where we may show a
    // list of connections.  I think we are probably safe in the FB connection list. I could be wrong, but
    // i think it uses the child resourceTable component, not this view... also what about future
    // features where we show lists of connections and may also show/filter on status?
    // instead of littering our presentation codebase with "refresh logic", should we not instead have
    // sone data-layer saga controlling this? possibly with a refresh fall-off policy, or track
    // user activity and stop polling if there is none, etc?
    // For connections resource table, we need to poll the connection status and queueSize
    if (resourceType === 'connections') {
      dispatch(actions.app.polling.start(actions.resource.connections.refreshStatus(), 10 * 1000));
    }

    return () => {
      dispatch(actions.app.polling.stopSpecificPollProcess(actions.resource.connections.refreshStatus()));
    };
  }, [dispatch, resourceType]);

  const actionProps = useMemo(() => ({ showTradingPartner }), [showTradingPartner]);
  const showPagingBar = list.count >= 100;
  const hidePagingBar = list.count === list.filtered;

  return (
    <CheckPermissions
      permission={
         PERMISSIONS &&
         PERMISSIONS[resourceType] &&
         PERMISSIONS[resourceType].view
       }>

      { /* This is where we will be adding all Right drawers to Celigo Table */}
      { resourceType === 'stacks' && <StackShareDrawer />}
      { resourceType === 'connections' && <ConfigConnectionDebugger />}

      <ResourceDrawer {...props} />
      <ScriptLogsDrawerRoute />

      <CeligoPageBar
        title={resourceType === 'iClients' ? resourceType : `${resourceName}s`}
        infoText={infoText[resourceType]} contentId={resourceType}>
        <ActionGroup>
          <KeywordSearch
            filterKey={resourceType}
            autoFocus
          />
          <TextButton
            data-test="addNewResource"
            component={Link}
            to={buildDrawerUrl({
              path: drawerPaths.RESOURCE.ADD,
              baseUrl: location.pathname,
              params: { resourceType, id: generateNewId() },
            })}
            startIcon={<AddIcon />}>
            Create {createResourceLabel}
          </TextButton>
        </ActionGroup>
      </CeligoPageBar>
      <PageContent showPagingBar={showPagingBar} hidePagingBar={hidePagingBar}>
        <LoadResources required resources={resourcesToLoad(resourceType)} spinner={spinner} >
          <ResourceTableWrapper
            resourceType={resourceType}
            hasNoData={!list.count && !list.total}
            hasEmptySearchResults={!list.count && list.total}>
            <ResourceTable
              resourceType={resourceType}
              resources={list.resources}
              actionProps={actionProps}
            />
          </ResourceTableWrapper>
        </LoadResources>
      </PageContent>
      <ShowMoreDrawer
        filterKey={resourceType}
        count={list.count}
        maxCount={list.filtered}
      />
    </CheckPermissions>
  );
}
