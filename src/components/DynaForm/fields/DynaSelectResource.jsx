import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  Select,
  FormControl,
  MenuItem,
  Input,
  InputLabel,
  IconButton,
  FormHelperText,
} from '@material-ui/core';
import * as selectors from '../../../reducers';
import AddIcon from '../../icons/AddIcon';
import LoadResources from '../../../components/LoadResources';

const useStyles = makeStyles({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  select: {
    display: 'flex',
    width: '100%',
  },
  iconButton: {
    height: 'fit-content',
    alignSelf: 'flex-end',
  },
});
const newId = () => `new-${shortid.generate()}`;

function DynaSelectResource(props) {
  const {
    description,
    disabled,
    id,
    name,
    value = '',
    label,
    placeholder,
    onFieldChange,
    resourceType,
    allowNew,
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
    // console.log('select resource createdId:', createdId);

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

  let resourceItems = filteredResources().map(conn => {
    const label = conn.name;
    const value = conn._id;

    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });
  const tempPlaceHolder = placeholder || 'Please Select';
  const defaultItem = (
    <MenuItem key={tempPlaceHolder} value="">
      {tempPlaceHolder}
    </MenuItem>
  );

  resourceItems = [defaultItem, ...resourceItems];

  return (
    <div className={classes.root}>
      <FormControl key={id} disabled={disabled} className={classes.select}>
        <InputLabel shrink={!!value} htmlFor={id}>
          {label}
        </InputLabel>
        <LoadResources required resources={resourceType}>
          <Select
            value={value}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}>
            {resourceItems}
          </Select>
        </LoadResources>
        {description && <FormHelperText>{description}</FormHelperText>}
      </FormControl>
      {allowNew && (
        <IconButton
          className={classes.iconButton}
          component={Link}
          to={`${location.pathname}/add/${resourceType}/${newResourceId}`}
          size="small">
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
}

export default withRouter(DynaSelectResource);
