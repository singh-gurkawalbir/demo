import React, { useState, useEffect, useCallback, useMemo } from 'react';
import sift from 'sift';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { selectors } from '../../../reducers';
import AddIcon from '../../icons/AddIcon';
import EditIcon from '../../icons/EditIcon';
import LoadResources from '../../LoadResources';
import DynaSelect from './DynaSelect';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import resourceMeta from '../../../forms/definitions';
import { generateNewId } from '../../../utils/resource';
import ActionButton from '../../ActionButton';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import useIntegration from '../../../hooks/useIntegration';
import StatusCircle from '../../StatusCircle';
import { stringCompare } from '../../../utils/sort';
import { defaultPatchSetConverter, getMissingPatchSet } from '../../../forms/formFactory/utils';

const emptyArray = [];
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
        application: options.appType,
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
      };
      if (isFrameWork2) {
        values = {
          ...values,
          '/type': 'integrationApp',
        };
      }
    } else {
      values = resourceMeta[resourceType].new.preSave({
        application: options.appType,
      });

      if (resourceType === 'asyncHelpers' || statusExport) {
        values = { ...values, '/_connectionId': expConnId };
      }

      if (resourceType === 'asyncHelpers') {
        values = { ...values, '/http/_asyncHelperId': generateNewId() };
      }
      if (resourceType === 'connections' && integrationId && integrationId !== 'none') {
        values = { ...values, '/integrationId': integrationId};
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
        'value'
      )
    );
  }

  history.push(`${location.pathname}/edit/${resourceType}/${newResourceId}`);
};

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  connectionStatusWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  dynaSelectMultiSelectActions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(4),
  },
  menuItem: {
    maxWidth: '95%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

function ConnectionLoadingChip(props) {
  const classes = useStyles();
  const { connectionId } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.resource.connections.pingAndUpdate(connectionId));
  }, [connectionId, dispatch]);

  const isConnectionOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );

  return isConnectionOffline ? (
    <div className={classes.connectionStatusWrapper}>
      <StatusCircle size="small" variant="error" />
      offline
    </div>
  ) : (
    <div className={classes.connectionStatusWrapper}>
      <StatusCircle size="small" variant="success" />
      online
    </div>
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
    filter,
    hideOnEmptyList = false,
    appTypeIsStatic = false,
    statusExport,
    ignoreEnvironmentFilter,
    resourceContext,
    skipPingConnection,
    integrationId,
    connectorId,
  } = props;
  const {options} = props;
  const classes = useStyles();
  const location = useLocation();
  const integrationIdFromUrl = useIntegration(resourceType, id);
  const dispatch = useDispatch();
  const history = useHistory();
  const [newResourceId, setNewResourceId] = useState(generateNewId());
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      ignoreEnvironmentFilter,
    }),
    [ignoreEnvironmentFilter, resourceType]
  );

  const { resources = emptyArray } = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );
  const isFrameWork2 = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)?.framework === 'twoDotZero'
  );
  const createdId = useSelector(state =>
    selectors.createdResourceId(state, newResourceId)
  );
  const allRegisteredConnectionIdsFromManagedIntegrations = useSelector(state => selectors.allRegisteredConnectionIdsFromManagedIntegrations(state));

  useEffect(() => {
    if (!appTypeIsStatic && options.appType && !!value) {
      onFieldChange(id, '', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options.appType]);

  useEffect(() => {
    if (createdId) {
      onFieldChange(id, createdId, true);
      // in case someone clicks + again to add another resource...
      setNewResourceId(generateNewId());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdId]);

  // When adding a new resource and subsequently editing it disable selecting a new connection
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

    return filteredResources.map(conn => ({
      label: conn.offline ? `${conn.name || conn._id} - Offline` : conn.name || conn._id,
      value: conn._id,
    }));
  }, [filter, options, resources, checkPermissions, allRegisteredConnectionIdsFromManagedIntegrations, resourceType]);
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceContext.resourceType,
      resourceContext.resourceId
    ) || {};
  const { expConnId, assistant } = useMemo(
    () => ({
      expConnId: merged && merged._connectionId,
      assistant: merged?.assistant,
    }),
    [merged]
  );
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
      }),
    [dispatch, history, location, resourceType, options, newResourceId, statusExport, expConnId, assistant, integrationId, integrationIdFromUrl, connectorId, isFrameWork2]
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
      dispatch(actions.resource.patchStaged(value, patchSet, 'value'));
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

      dispatch(actions.resource.patchStaged(value, patchSet, 'value'));
    }

    history.push(`${location.pathname}/edit/${resourceType}/${value}`);
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
    }));

  if (!resourceItems.length && hideOnEmptyList) {
    return null;
  }

  return (
    <div className={classes.root}>
      <LoadResources required resources={resourceType !== 'connectorLicenses' ? resourceType : ''}>
        {multiselect ? (
          <DynaMultiSelect
            {...props}
            disabled={disableSelect}
            options={[{ items: resourceItems || [] }]}
          />
        ) : (
          <DynaSelect
            {...props}
            disabled={disableSelect}
            removeHelperText={isAddingANewResource}
            options={[{ items: truncatedItems(resourceItems || []) }]}
          />
        )}
      </LoadResources>
      <div className={classes.dynaSelectMultiSelectActions}>
        {allowNew && (
          <ActionButton
            data-test="addNewResource"
            onClick={handleAddNewResourceMemo}>
            <AddIcon />
          </ActionButton>
        )}

        {allowEdit && (
          // Disable adding a new resource when the user has selected an existing resource
          <ActionButton
            disabled={!value}
            data-test="editNewResource"
            onClick={handleEditResource}>
            <EditIcon />
          </ActionButton>
        )}
        {resourceType === 'connections' && !!value && !skipPingConnection && (
          <ConnectionLoadingChip connectionId={value} />
        )}
      </div>
    </div>
  );
}
