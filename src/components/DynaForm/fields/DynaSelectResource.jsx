import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import { makeStyles, fade } from '@material-ui/core/styles';
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
import ArrowDownIcon from '../../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  select: {
    display: 'flex',
    width: '100%',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 50,
    borderRadius: 2,
    '& > Label': {
      zIndex: 1,

      '&.MuiInputLabel-shrink': {
        paddingTop: 10,
      },
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
      zIndex: 2,
    },
    '& svg': {
      right: 8,
    },
  },
  iconButton: {
    height: 'fit-content',
    alignSelf: 'flex-end',
    border: '1px solid',
    background: theme.palette.background.paper,
    marginLeft: 5,
    borderColor: fade(theme.palette.common.black, 0.1),
    borderRadius: 0,
  },
}));
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
            data-test={id}
            value={value}
            variant="filled"
            IconComponent={ArrowDownIcon}
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
