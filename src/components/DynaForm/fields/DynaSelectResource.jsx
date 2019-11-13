import React, { useState, useEffect } from 'react';
import sift from 'sift';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
    '& > div:first-child': {
      width: '100%',
    },
  },
  actions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  iconButton: {
    alignSelf: 'flex-end',
    border: '1px solid',
    background: theme.palette.background.paper,
    marginLeft: 5,
    borderColor: theme.palette.secondary.lightest,
    borderRadius: 0,
    width: 50,
    height: 50,
    color: theme.palette.text.hint,
    '&:hover': {
      background: theme.palette.background.paper,
      color: theme.palette.primary.main,
    },
  },
}));
const newId = () => `${generateNewId()}`;

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
    location,
    options,
    filter,
    ignoreEnvironmentFilter,
  } = props;
  const classes = useStyles();
  const [newResourceId, setNewResourceId] = useState(newId());
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
    if (createdId) {
      onFieldChange(id, createdId);
      // in case someone clicks + again to add another resource...
      setNewResourceId(newId());
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
  const dispatch = useDispatch();
  const addNewResource = () => {
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

    props.history.push(
      `${location.pathname}/edit/${resourceType}/${newResourceId}`
    );
  };

  // Disable adding a new resource when the user has selected an existing resource
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
          <IconButton
            data-test="addNewResource"
            className={classes.iconButton}
            onClick={addNewResource}
            size="small">
            <AddIcon />
          </IconButton>
        )}

        {allowEdit && (
          <IconButton
            disabled={!value}
            data-test="editNewResource"
            className={classes.iconButton}
            component={Link}
            to={`${location.pathname}/edit/${resourceType}/${value}`}
            size="small">
            <EditIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default withRouter(DynaSelectResource);
