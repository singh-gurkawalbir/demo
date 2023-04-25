import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import sift from 'sift';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { isEqual } from 'lodash';
import { selectors } from '../../../reducers';
import AddIcon from '../../icons/AddIcon';
import EditIcon from '../../icons/EditIcon';
import LoadResources from '../../LoadResources';
import DynaSelect from './DynaSelect';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import resourceMeta from '../../../forms/definitions';
import { generateNewId, MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import useIntegration from '../../../hooks/useIntegration';
import { stringCompare } from '../../../utils/sort';
import { defaultPatchSetConverter, getMissingPatchSet } from '../../../forms/formFactory/utils';
import OnlineStatus from '../../OnlineStatus';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';
import Spinner from '../../Spinner';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants';
import { getHttpConnector} from '../../../constants/applications';

const emptyArray = [];
const emptyObj = {};

const handleAddNewResource = args => {
  const {
    dispatch,
    history,
    location,
    resourceType,
    options,
    newResourceId,
    expConnId,
    statusExport,
    assistant,
    integrationId,
    connectorId,
    isFrameWork2,
    email,
    _httpConnectorId,
  } = args;

  if (
    [
      'exports',
      'imports',
      'connections',
      'pageProcessor',
      'pageGenerator',
      'asyncHelpers',
      'iClients',
      'connectorLicenses',
    ].includes(resourceType)
  ) {
    let values;

    if (['pageProcessor', 'pageGenerator'].includes(resourceType)) {
      values = resourceMeta[resourceType].preSave({
        application: options?.appType,
      });
    } else if (['iClients'].includes(resourceType)) {
      values = {
        ...values,
        '/assistant': assistant,
      };
    } else if (['connectorLicenses'].includes(resourceType)) {
      values = {
        ...values,
        '/_connectorId': connectorId,
        '/trialLicenseTemplate': true,
        '/email': email,
      };
      if (isFrameWork2) {
        values = {
          ...values,
          '/type': 'integrationApp',
        };
      }
    } else {
      values = resourceMeta[resourceType].new.preSave({
        application: options?.appType,
        _httpConnectorId,
      });

      if (resourceType === 'asyncHelpers' || statusExport) {
        values = { ...values, '/_connectionId': expConnId };
      }

      if (resourceType === 'asyncHelpers') {
        values = { ...values, '/http/_asyncHelperId': generateNewId() };
      }
      if (resourceType === 'connections' && integrationId && integrationId !== 'none') {
        values = { ...values, '/integrationId': integrationId, '/_connectorId': connectorId,
        };
      }

      if (statusExport) {
        values = { ...values, '/statusExport': true };
      }
    }

    const patchValues = defaultPatchSetConverter(values);
    const missingPatches = getMissingPatchSet(
      patchValues.map(patch => patch.path),
      {}
    );

    dispatch(
      actions.resource.patchStaged(
        newResourceId,
        [...missingPatches, ...patchValues],
      )
    );
  }

  history.push(buildDrawerUrl({
    path: drawerPaths.RESOURCE.EDIT,
    baseUrl: location.pathname,
    params: { resourceType, id: newResourceId },
  }));
};

const getType = resourceType => {
  let type = 'connection';

  if (['connectorLicenses'].includes(resourceType)) {
    type = MODEL_PLURAL_TO_LABEL[resourceType]?.toLowerCase();
  } else if (RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]) {
    type = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];
  }

  return type;
};

const addIconTitle = (resourceType, title) => {
  if (title) {
    return title;
  }

  return `Add ${getType(resourceType)}`;
};

const ediIconTitle = (resourceType, title) => {
  if (title) {
    return title;
  }

  return `Edit ${getType(resourceType)}`;
};

const disabledIconTitle = (resourceType, title) => {
  if (title) {
    return title;
  }

  return `Select a ${getType(resourceType)} to allow editing`;
};

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectMultiSelectActions: {
    display: 'flex',
    marginTop: 26,
    marginLeft: theme.spacing(0.5),
    '& >* button': {
      padding: theme.spacing(0.5),
    },
  },
  dynaSelectMultiSelectActionsFlow: {
    display: 'flex',
    marginLeft: theme.spacing(0.5),
    '& >* button': {
      padding: theme.spacing(0.5),
    },
  },
  menuItem: {
    maxWidth: '95%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
  dynaSelectWithStatusWrapper: {
    position: 'relative',
    '& > div:last-child': {
      position: 'absolute',
      right: theme.spacing(5),
      top: theme.spacing(4),
      '& .MuiTypography-root': {
        font: 'inherit',
      },
    },
    '& .MuiSelect-selectMenu': {
      paddingRight: 140,
    },
  },
}));

function ConnectionLoadingChip(props) {
  const { connectionId, flowId, integrationId, parentType, parentId} = props;
  const parentContext = useMemo(() => ({
    flowId,
    integrationId,
    parentType,
    parentId,
  }), [flowId, integrationId, parentId, parentType]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.resource.connections.pingAndUpdate(connectionId, parentContext));
  }, [connectionId, dispatch, parentContext]);

  const isConnectionOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );

  return (
    <OnlineStatus offline={isConnectionOffline} />
  );
}
export default function DynaSelectResource(props) {
  const {
    disabled,
    id,
    onFieldChange,
    multiselect = false,
    value,
    resourceType,
    allowNew,
    allowEdit,
    checkPermissions = false,
    hideOnEmptyList = false,
    appTypeIsStatic = false,
    statusExport,
    ignoreEnvironmentFilter,
    resourceContext,
    skipPingConnection,
    integrationId,
    connectorId,
    flowId,
    addTitle,
    editTitle,
    disabledTitle,
    isValueValid = false,
    isSelectFlowResource,
  } = props;
  let {filter} = props;
  const { options = {}, getItemInfo } = props;
  const classes = useStyles();
  const location = useLocation();
  const integrationIdFromUrl = useIntegration(resourceType, id);
  const dispatch = useDispatch();
  const history = useHistory();
  const [newResourceId, setNewResourceId] = useState(generateNewId());

  const optionRef = useRef(options);

  useEffect(() => {
    if (!isEqual(optionRef.current, options)) {
      optionRef.current = options;
    }
  }, [options]);
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      ignoreEnvironmentFilter,
    }),
    [ignoreEnvironmentFilter, resourceType]
  );

  const hasResourceTypeLoaded = useSelector(state => selectors.hasResourcesLoaded(state, resourceType));

  const isHTTPVersionUpdated = useSelector(state => selectors.isHTTPConnectionVersionModified(state));
  const { resources = emptyArray } = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );
  const isFrameWork2 = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)?.framework === 'twoDotZero'
  );
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const createdId = useSelector(state =>
    selectors.createdResourceId(state, newResourceId)
  );
  const allRegisteredConnectionIdsFromManagedIntegrations = useSelector(state => selectors.allRegisteredConnectionIdsFromManagedIntegrations(state));

  useEffect(() => {
    if (!appTypeIsStatic && options?.appType && !!value) {
      onFieldChange(id, '', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options?.appType]);

  useEffect(() => {
    if (createdId) {
      onFieldChange(id, createdId, false);
      // in case someone clicks + again to add another resource...
      setNewResourceId(generateNewId());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdId]);
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceContext.resourceType,
      resourceContext.resourceId
    ) || {};
  // When adding a new resource and subsequently editing it disable selecting a new connection
  // TODO @Raghu: Using URLs for condition! Do we need it?
  const isAddingANewResource =
    allowNew &&
    (location.pathname.endsWith(`/add/${resourceType}/${newResourceId}`) ||
      location.pathname.endsWith(`/edit/${resourceType}/${newResourceId}`));
  const disableSelect = disabled || isAddingANewResource;
  const resourceItems = useMemo(() => {
    let filteredResources = resources;

    if ((options && options.filter) || filter) {
      filteredResources = filteredResources.filter(
        sift(options && options.filter ? options.filter : filter)
      );
    }
    if (resourceType === 'connections' && checkPermissions) {
      filteredResources = filteredResources.filter(r => allRegisteredConnectionIdsFromManagedIntegrations.includes(r._id));
    }
    if (resourceType === 'iClients' && (merged?.adaptorType === 'HTTPConnection' || merged?.type === 'http') && (merged?._httpConnectorId || merged?.http?._httpConnectorId)) {
      filter = {...filter, _httpConnectorId: (merged._httpConnectorId || merged.http._httpConnectorId)};
      filteredResources = filteredResources.filter(sift(filter));
    }

    return filteredResources.map(conn => {
      const result = {
        label: conn.offline ? `${conn.name || conn._id} - Offline` : conn.name || conn._id,
        value: conn._id,
        itemInfo: getItemInfo?.(conn),
      };

      if (resourceType === 'connections') {
        return ({
          ...result,
          connInfo: {
            httpConnectorId: conn?.http?._httpConnectorId,
            httpConnectorApiId: conn?.http?._httpConnectorApiId,
            httpConnectorVersionId: conn?.http?._httpConnectorVersionId,
          },
        });
      }

      return result;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, optionRef.current, filter, resourceType, checkPermissions, allRegisteredConnectionIdsFromManagedIntegrations]);
  const { expConnId, assistant } = useMemo(
    () => ({
      expConnId: merged && merged._connectionId,
      assistant: merged?.assistant,
    }),
    [merged]
  );
  const connection = useSelectorMemo(selectors.makeResourceDataSelector, 'connections', (resourceType === 'connections' ? value : expConnId))?.merged || emptyObj;
  const _httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId)?._id;

  const handleAddNewResourceMemo = useCallback(
    () =>
      handleAddNewResource({
        dispatch,
        history,
        location,
        resourceType,
        options,
        newResourceId,
        statusExport,
        expConnId,
        assistant,
        integrationId: integrationId || integrationIdFromUrl,
        connectorId,
        isFrameWork2,
        email: preferences?.email,
        _httpConnectorId,
      }),
    [dispatch, history, location, resourceType, options, newResourceId, statusExport, expConnId, assistant, integrationId, integrationIdFromUrl, connectorId, isFrameWork2, preferences?.email, _httpConnectorId]
  );
  const handleEditResource = useCallback(() => {
    if (
      resourceType === 'asyncHelpers' ||
      (resourceType === 'exports' && statusExport)
    ) {
      const patchSet = [
        {
          op: 'add',
          path: '/_connectionId',
          value: expConnId,
        },
      ];

      if (statusExport) {
        patchSet.push({
          op: 'add',
          path: '/statusExport',
          value: true,
        });
      }

      // this not an actual value we would like to commit...this is just to load the right form
      dispatch(actions.resource.patchStaged(value, patchSet));
    }
    if (resourceType === 'connectorLicenses') {
      const patchSet = [
        {
          op: 'add',
          path: '/_connectorId',
          value: connectorId,
        },
        {
          op: 'add',
          path: '/trialLicenseTemplate',
          value: true,
        },
      ];

      if (isFrameWork2) {
        patchSet.push({
          op: 'add',
          path: '/type',
          value: 'integrationApp',
        });
      }

      dispatch(actions.resource.patchStaged(value, patchSet));
    }

    history.push(buildDrawerUrl({
      path: drawerPaths.RESOURCE.EDIT,
      baseUrl: location.pathname,
      params: { resourceType, id: value },
    }));
  }, [isFrameWork2, connectorId, dispatch, expConnId, history, location.pathname, resourceType, statusExport, value]);
  const truncatedItems = items =>
    items.sort(stringCompare('label')).map(i => ({
      label: (
        <div title={i.label} className={classes.menuItem}>
          {i.label}
        </div>
      ),
      optionSearch: i.label,
      value: i.value,
      itemInfo: i.itemInfo,
      connInfo: i.connInfo,
    }));

  useEffect(() => {
    if (isHTTPVersionUpdated && _httpConnectorId) {
      onFieldChange(value, value);
      dispatch(actions.connection.clearUpdatedVersion());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHTTPVersionUpdated]);
  useEffect(() => {
    if (!appTypeIsStatic && value && !Array.isArray(value) && isValueValid) {
      const isValuePresentInOption = resourceItems.find(eachItem => eachItem.value === value);

      if (!isValuePresentInOption) {
        onFieldChange(id, '', true);
      }
    }

  // resourceItems are filtered by options,
  // if options change then resourceItems also change, hence adding options as a dependency here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionRef.current]);

  if (!resourceItems.length && hideOnEmptyList && hasResourceTypeLoaded) {
    return null;
  }

  return (
    <div className={classes.root}>
      <LoadResources
        required
        spinner={<Spinner size="medium" />}
        resources={resourceType !== 'connectorLicenses' ? resourceType : []}
      >
        <>
          {multiselect ? (
            <DynaMultiSelect
              {...props}
              disabled={disableSelect}
              options={[{ items: resourceItems || [] }]}
          />
          ) : (
            <div className={clsx(classes.dynaSelectWrapper, {[classes.dynaSelectWithStatusWrapper]: resourceType === 'connections' && !!value && !skipPingConnection})}>
              <DynaSelect
                {...props}
                disabled={disableSelect}
                removeHelperText={isAddingANewResource}
                options={[{ items: truncatedItems(resourceItems || []) }]}
                isSelectFlowResource={isSelectFlowResource}
          />
              {resourceType === 'connections' && !!value && !skipPingConnection && (
              <ConnectionLoadingChip
                connectionId={value}
                flowId={flowId}
                integrationId={integrationId || integrationIdFromUrl}
                parentType={resourceContext.resourceType}
                parentId={resourceContext.resourceId} />
              )}
            </div>

          )}
          <div className={clsx({[classes.dynaSelectMultiSelectActionsFlow]: isSelectFlowResource}, {[classes.dynaSelectMultiSelectActions]: !isSelectFlowResource})}>
            {allowNew && (
            <IconButtonWithTooltip
              tooltipProps={{title: `${addIconTitle(resourceType, addTitle)}`}}
              data-test="addNewResource"
              onClick={handleAddNewResourceMemo}
              buttonSize="small">
              <AddIcon />
            </IconButtonWithTooltip>
            )}

            {allowEdit && (
            // Disable adding a new resource when the user has selected an existing resource
            <IconButtonWithTooltip
              tooltipProps={{title: value ? `${ediIconTitle(resourceType, editTitle)}` : `${disabledIconTitle(resourceType, disabledTitle)}`}} disabled={!value}
              data-test="editNewResource"
              onClick={handleEditResource}
              buttonSize="small">
              <EditIcon />
            </IconButtonWithTooltip>
            )}

          </div>
        </>
      </LoadResources>

    </div>
  );
}
