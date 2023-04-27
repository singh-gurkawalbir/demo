import React from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import { sortBy } from 'lodash';
import {
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../constants/resource';
import CeligoSelect from '../CeligoSelect';
import { AUDIT_LOG_EVENT_LABELS } from '../../constants/auditLog';
import { STANDALONE_INTEGRATION } from '../../constants';

const OPTION_ALL = { id: 'all', label: 'All' };

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

const resourceTypeInput = {
  name: 'resourceType',
  id: 'resourceType',
};

const eventInput = {
  name: 'event',
  id: 'event',
};

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
    'apis',
    'agents',
    'iClients',
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
          'revision',
          'script',
          'agent',
          'notification',
        ],
  };

  resourceTypeFilterOptionsByResourceType.all =
    [...resourceTypeFilterOptionsByResourceType.integrations, 'accesstoken', 'ssoclient', 'user', 'api'];

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <CeligoSelect
        value={filters.resourceType || ''}
        onChange={onChange}
        // all options are harmless ...mostly resourceTypes
        isLoggable
        inputProps={resourceTypeInput}>
        <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
          Select resource type
        </MenuItem>
        {[
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

const resourceIdInput = {
  name: '_resourceId',
  id: '_resourceId',
};

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
    <FormControl variant="standard" className={classes.formControl}>
      <CeligoSelect
        isLoggable
        inputProps={resourceIdInput}
        className={classes.select}
        value={filters._resourceId || ''}
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

export function AuditLogActionFilter({
  classes,
  filters,
  onChange,
  resource,
  resourceType,
  resourceId,
}) {
  return (
    <FormControl variant="standard" className={classes.formControl}>
      <CeligoSelect
        isLoggable
        inputProps={eventInput}
        onChange={onChange}
        value={filters.event || ''}>
        <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
          Select action
        </MenuItem>
        {[
          ...Object.keys(AUDIT_LOG_EVENT_LABELS)
            .filter(k => {
              // For integration and resource type audit logs, signin and signout actions should not be shown
              if (resourceType === 'integrations' && resourceId === STANDALONE_INTEGRATION.id) {
                return !['signin', 'signout'].includes(k);
              }

              if (!resource) {
                return true;
              }

              return !['signin', 'signout'].includes(k);
            })
            .map(k => [k, AUDIT_LOG_EVENT_LABELS[k]]),
        ].map(opt => (
          <MenuItem key={opt[0]} value={opt[0]}>
            {opt[1]}
          </MenuItem>
        ))}
      </CeligoSelect>
    </FormControl>
  );
}
