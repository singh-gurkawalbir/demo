import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy } from 'lodash';
import {
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../constants/resource';
import { OPTION_ALL } from './util';
import CeligoSelect from '../CeligoSelect';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(1),
    minWidth: 150,
    maxWidth: theme.spacing(30),
    height: 36,
    '&:first-child': {
      marginLeft: theme.spacing(1),
    },
  },
}));

export function ResourceTypeFilter(props) {
  const classes = useStyles();
  const {
    resourceType,
    resourceId,
    filters,
    resourceDetails,
    onChange,
  } = props;
  const hideFilterForResourceTypes = [
    'accesstokens',
    'connections',
    'stacks',
    'scripts',
  ];
  const resource =
    resourceType &&
    resourceDetails[resourceType] &&
    resourceDetails[resourceType][resourceId];

  if (hideFilterForResourceTypes.includes(resourceType)) {
    return null;
  }

  const resourceTypeFilterOptionsByResourceType = {
    exports: ['export', 'connection', 'stack'],
    imports: ['import', 'connection', 'stack'],
    flows: [
      'flow',
      'export',
      'import',
      'connection',
      'stack',
      'asynchelper',
      'filedefinition',
    ],
    integrations:
      resource && resource._connectorId
        ? ['integration', 'flow', 'connection', 'import', 'export']
        : [
          'integration',
          'flow',
          'export',
          'import',
          'connection',
          'stack',
          'asynchelper',
          'filedefinition',
        ],
  };

  resourceTypeFilterOptionsByResourceType.all =
    resourceTypeFilterOptionsByResourceType.integrations;

  return (
    <FormControl className={classes.formControl}>
      <CeligoSelect
        value={filters.resourceType}
        onChange={onChange}
        inputProps={{
          name: 'resourceType',
          id: 'resourceType',
        }}>
        <MenuItem value="" disabled>
          Select resource type
        </MenuItem>
        {[
          [OPTION_ALL.id, OPTION_ALL.label],
          ...resourceTypeFilterOptionsByResourceType[resourceType || 'all'].map(
            rt => [rt, RESOURCE_TYPE_SINGULAR_TO_LABEL[rt]]
          ),
        ].map(opt => (
          <MenuItem key={opt[0]} value={opt[0]}>
            {opt[1]}
          </MenuItem>
        ))}
      </CeligoSelect>
    </FormControl>
  );
}

export function ResourceIdFilter(props) {
  const {
    classes,
    affectedResources,
    resourceDetails,
    resourceType,
    filters,
    onChange,
  } = props;
  const filterResourceType =
    RESOURCE_TYPE_SINGULAR_TO_PLURAL[filters.resourceType];

  if (
    !filters.resourceType ||
    filters.resourceType === OPTION_ALL.id ||
    filterResourceType === resourceType
  ) {
    return null;
  }

  let options = [];

  affectedResources[filters.resourceType] &&
    affectedResources[filters.resourceType].forEach(ar => {
      if (resourceDetails[filterResourceType]) {
        options.push({
          id: ar,
          name:
            resourceDetails[filterResourceType][ar] &&
            resourceDetails[filterResourceType][ar].name,
        });
      }
    });

  options = sortBy(options, ['name']);

  const menuOptions = options.map(opt => (
    <MenuItem key={opt.id} value={opt.id}>
      {opt.name || opt.id}
    </MenuItem>
  ));

  return (
    <FormControl className={classes.formControl}>
      <CeligoSelect
        inputProps={{
          name: '_resourceId',
          id: '_resourceId',
        }}
        variant="filled"
        className={classes.select}
        value={filters._resourceId}
        onChange={onChange}>
        <MenuItem value="" disabled>
          Select {RESOURCE_TYPE_SINGULAR_TO_LABEL[filters.resourceType]}
        </MenuItem>
        <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
          {OPTION_ALL.label}
        </MenuItem>
        {menuOptions}
      </CeligoSelect>
    </FormControl>
  );
}
