import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../reducers';
import AddIcon from '../../icons/AddIcon';
import EditIcon from '../../icons/EditIcon';
import LoadResources from '../../../components/LoadResources';
import DynaSelect from './DynaSelect';
import DynaMultiSelect from './DynaMultiSelect';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
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
const newId = () => `new-${shortid.generate()}`;

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
  } = props;
  const classes = useStyles();
  const [newResourceId, setNewResourceId] = useState(newId());
  const { resources = [] } = useSelector(state =>
    selectors.resourceList(state, { type: resourceType })
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
  const filteredResources = () => {
    const { resourceType, filter, excludeFilter, options } = props;

    if (!resourceType) return [];
    const finalFilter = options && options.filter ? options.filter : filter;

    return resources.filter(r => {
      if (finalFilter) {
        const keys = Object.keys(finalFilter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (typeof finalFilter[key] === 'object') {
            const result = Object.keys(finalFilter[key]).reduce(
              (acc, curr) =>
                acc && finalFilter[key][curr] === (r[key] && r[key][curr]),
              true
            );

            if (!result) return false;
          } else if (r[key] !== finalFilter[key]) return false;
        }
      }

      if (excludeFilter) {
        const keys = Object.keys(excludeFilter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] === excludeFilter[key]) return false;
        }
      }

      return true;
    });
  };

  // When adding a new resource and subsequently editing it disable selecting a new connection
  const isAddingANewResource =
    allowNew &&
    (location.pathname.endsWith(`/add/${resourceType}/${newResourceId}`) ||
      location.pathname.endsWith(`/edit/${resourceType}/${newResourceId}`));
  const disableSelect = disabled || isAddingANewResource;
  const resourceItems = filteredResources().map(conn => ({
    label: conn.name,
    value: conn._id,
  }));

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

      {allowNew && (
        <IconButton
          disabled={!!value}
          data-test="addNewResource"
          className={classes.iconButton}
          component={Link}
          to={`${location.pathname}/add/${resourceType}/${newResourceId}`}
          size="small">
          <AddIcon />
        </IconButton>
      )}

      {allowEdit && (
        <IconButton
          disabled={!value}
          data-test="addNewResource"
          className={classes.iconButton}
          component={Link}
          to={`${location.pathname}/edit/${resourceType}/${value}`}
          size="small">
          <EditIcon />
        </IconButton>
      )}
    </div>
  );
}

export default withRouter(DynaSelectResource);
