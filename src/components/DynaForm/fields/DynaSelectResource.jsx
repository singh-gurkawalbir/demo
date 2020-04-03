import { Chip } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import sift from 'sift';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as selectors from '../../../reducers';
import AddIcon from '../../icons/AddIcon';
import EditIcon from '../../icons/EditIcon';
import LoadResources from '../../../components/LoadResources';
import DynaSelect from './DynaSelect';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import resourceMeta from '../../../forms/definitions';
import { generateNewId } from '../../../utils/resource';
import {
  defaultPatchSetConverter,
  getMissingPatchSet,
} from '../../../forms/utils';
import ActionButton from '../../../components/ActionButton';
import Spinner from '../../Spinner';

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
    ].includes(resourceType)
  ) {
    let values;

    if (['pageProcessor', 'pageGenerator'].includes(resourceType))
      values = resourceMeta[resourceType].preSave({
        application: options.appType,
      });
    else if (['iClients'].includes(resourceType)) {
      values = {
        ...values,
        '/assistant': assistant,
      };
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

const useStyles = makeStyles({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
    '& > div:first-child': {
      width: '100%',
      marginRight: 6,
      overflow: 'auto',
    },
  },
  actions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  menuItem: {
    maxWidth: '95%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});

function ConnectionLoadingChip(props) {
  const { connectionId } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.resource.connections.pingAndUpdate(connectionId));
  }, [connectionId, dispatch]);

  const connectionOffline = useSelector(
    state => selectors.connectionStatus(state, connectionId).offline
  );
  const connectionRequestStatus = useSelector(
    state => selectors.connectionStatus(state, connectionId).requestStatus
  );

  if (!connectionRequestStatus || connectionRequestStatus === 'failed') {
    return null;
  }

  if (connectionRequestStatus === 'requested') {
    return <Spinner />;
  }

  return connectionOffline ? (
    <Chip color="secondary" label="Offline" />
  ) : (
    <Chip color="primary" label="Online" />
  );
}

function DynaSelectResource(props) {
  const {
    disabled,
    id,
    onFieldChange,
    multiselect = false,
    value,
    resourceType,
    allowNew,
    allowEdit,
    options,
    filter,
    hideOnEmptyList = false,
    appTypeIsStatic = false,
    statusExport,
    ignoreEnvironmentFilter,
    resourceContext,
  } = props;
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [newResourceId, setNewResourceId] = useState(generateNewId());
  const resources = useSelector(
    state =>
      selectors.resourceList(state, {
        type: resourceType,
        ignoreEnvironmentFilter,
      }).resources || emptyArray
  );
  const createdId = useSelector(state =>
    selectors.createdResourceId(state, newResourceId)
  );

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
  let filteredResources = resources;

  if ((options && options.filter) || filter) {
    filteredResources = filteredResources.filter(
      sift(options && options.filter ? options.filter : filter)
    );
  }

  // When adding a new resource and subsequently editing it disable selecting a new connection
  const isAddingANewResource =
    allowNew &&
    (location.pathname.endsWith(`/add/${resourceType}/${newResourceId}`) ||
      location.pathname.endsWith(`/edit/${resourceType}/${newResourceId}`));
  const disableSelect = disabled || isAddingANewResource;
  const resourceItems = filteredResources.map(conn => ({
    label: conn.name || conn._id,
    value: conn._id,
  }));
  const { expConnId, assistant } = useSelector(state => {
    const { merged } =
      selectors.resourceData(
        state,
        resourceContext.resourceType,
        resourceContext.resourceId
      ) || {};

    return {
      expConnId: merged && merged._connectionId,
      assistant: merged.assistant,
    };
  });
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
      }),
    [
      dispatch,
      history,
      location,
      resourceType,
      options,
      newResourceId,
      statusExport,
      expConnId,
      assistant,
    ]
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

      // this not an actual value we would like to commit...this is just to load the right form
      dispatch(actions.resource.patchStaged(value, patchSet, 'value'));
    }

    history.push(`${location.pathname}/edit/${resourceType}/${value}`);
  }, [
    dispatch,
    expConnId,
    history,
    location.pathname,
    resourceType,
    statusExport,
    value,
  ]);
  const truncatedItems = items =>
    items.map(i => ({
      label: (
        <div title={i.label} className={classes.menuItem}>
          {i.label}
        </div>
      ),
      value: i.value,
    }));

  // console.log(truncatedItems(resourceItems || []));

  if (!resourceItems.length && hideOnEmptyList) {
    return null;
  }

  return (
    <div className={classes.root}>
      <LoadResources required resources={resourceType}>
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
      <div className={classes.actions}>
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
        {resourceType === 'connections' && !!value && (
          <ConnectionLoadingChip
            resourceType={resourceType}
            connectionId={value}
          />
        )}
      </div>
    </div>
  );
}

export default DynaSelectResource;
