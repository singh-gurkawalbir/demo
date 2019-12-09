import React, { useState, useEffect, useCallback } from 'react';
import sift from 'sift';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
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

const handleAddNewResource = args => {
  const {
    dispatch,
    history,
    location,
    resourceType,
    options,
    newResourceId,
  } = args;

  if (
    [
      'exports',
      'imports',
      'connections',
      'pageProcessor',
      'pageGenerator',
    ].includes(resourceType)
  ) {
    let values;

    if (['pageProcessor', 'pageGenerator'].includes(resourceType))
      values = resourceMeta[resourceType].preSave({
        application: options.appType,
        '/name': `New ${options.appType} resource`,
      });
    else
      values = resourceMeta[resourceType].new.preSave({
        application: options.appType,
        '/name': `New ${options.appType} resource`,
      });
    const patchValues = defaultPatchSetConverter(values);
    const missingPatches = getMissingPatchSet(
      patchValues.map(patch => patch.path)
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
      overflow: 'scroll',
    },
  },
  actions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
});

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
    ignoreEnvironmentFilter,
  } = props;
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [newResourceId, setNewResourceId] = useState(generateNewId());
  const { resources = [] } = useSelector(state =>
    selectors.resourceList(state, {
      type: resourceType,
      ignoreEnvironmentFilter,
    })
  );
  const createdId = useSelector(state =>
    selectors.createdResourceId(state, newResourceId)
  );

  useEffect(() => {
    if (options.appType) {
      onFieldChange(id, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options.appType]);

  useEffect(() => {
    if (createdId) {
      onFieldChange(id, createdId);
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
    label: conn.name,
    value: conn._id,
  }));
  const handleAddNewResourceMemo = useCallback(
    () =>
      handleAddNewResource({
        dispatch,
        history,
        location,
        resourceType,
        options,
        newResourceId,
      }),
    [dispatch, history, location, newResourceId, options, resourceType]
  );

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
            options={[{ items: resourceItems || [] }]}
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
            component={Link}
            to={`${location.pathname}/edit/${resourceType}/${value}`}>
            <EditIcon />
          </ActionButton>
        )}
      </div>
    </div>
  );
}

export default DynaSelectResource;
