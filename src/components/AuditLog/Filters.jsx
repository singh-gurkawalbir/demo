import { Component } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core';
import * as _ from 'lodash';
import {
  AUDIT_LOG_SOURCE_LABELS,
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../utils/constants';
import * as selectors from '../../reducers';

const optionAll = { id: 'all', label: 'All' };
const mapStateToProps = (state, { resourceType, resourceId }) => {
  const {
    affectedResources,
    users,
  } = selectors.affectedResourcesAndUsersFromAuditLogs(
    state,
    resourceType,
    resourceId
  );

  return {
    affectedResources,
    users,
  };
};

@withStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
}))
class Filters extends Component {
  state = {
    filters: {
      resourceType: optionAll.id,
      _resourceId: optionAll.id,
      byUser: optionAll.id,
      source: optionAll.id,
    },
  };
  getResource = () => {
    const { resourceType, resourceId, resourceDetails } = this.props;
    const resource =
      resourceType &&
      resourceDetails[resourceType] &&
      resourceDetails[resourceType][resourceId];

    return resource;
  };
  getResourceTypeFilter = () => {
    const { classes, resourceType } = this.props;
    const { filters } = this.state;
    const hideFilterForResourceTypes = [
      'accesstokens',
      'connections',
      'stacks',
    ];
    const resource = this.getResource();

    if (resource && resource._connectorId) {
      hideFilterForResourceTypes.push('flows');
    }

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
          ? ['integration', 'flow', 'connection', 'import']
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
        <InputLabel htmlFor="resourceType">Select Resource Type</InputLabel>
        <Select
          value={filters.resourceType}
          onChange={this.handleChange}
          inputProps={{
            name: 'resourceType',
            id: 'resourceType',
          }}>
          {[
            [optionAll.id, optionAll.label],
            ...resourceTypeFilterOptionsByResourceType[
              resourceType || 'all'
            ].map(rt => [rt, RESOURCE_TYPE_SINGULAR_TO_LABEL[rt]]),
          ].map(opt => (
            <MenuItem key={opt[0]} value={opt[0]}>
              {opt[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  getResourceIdFilter = () => {
    const { filters } = this.state;
    const {
      classes,
      affectedResources,
      resourceDetails,
      resourceType,
    } = this.props;

    if (
      !filters.resourceType ||
      filters.resourceType === optionAll.id ||
      RESOURCE_TYPE_SINGULAR_TO_PLURAL[filters.resourceType] === resourceType
    ) {
      return null;
    }

    let options = [];

    affectedResources[filters.resourceType] &&
      affectedResources[filters.resourceType].forEach(ar => {
        if (
          resourceDetails[
            RESOURCE_TYPE_SINGULAR_TO_PLURAL[filters.resourceType]
          ]
        )
          options.push({
            id: ar,
            name:
              resourceDetails[
                RESOURCE_TYPE_SINGULAR_TO_PLURAL[filters.resourceType]
              ][ar] &&
              resourceDetails[
                RESOURCE_TYPE_SINGULAR_TO_PLURAL[filters.resourceType]
              ][ar].name,
          });
      });

    options = _.sortBy(options, ['name']);

    const menuOptions = options.map(opt => (
      <MenuItem key={opt.id} value={opt.id}>
        {opt.name || opt.id}
      </MenuItem>
    ));

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="_resourceId">
          Select {RESOURCE_TYPE_SINGULAR_TO_LABEL[filters.resourceType]}
        </InputLabel>
        <Select
          inputProps={{
            name: '_resourceId',
            id: '_resourceId',
          }}
          value={filters._resourceId}
          onChange={this.handleChange}>
          <MenuItem key={optionAll.id} value={optionAll.id}>
            {optionAll.label}
          </MenuItem>
          {menuOptions}
        </Select>
      </FormControl>
    );
  };
  handleChange = event => {
    const { filters } = this.state;
    const toUpdate = { ...filters, [event.target.name]: event.target.value };

    if (event.target.name === 'resourceType') {
      toUpdate._resourceId = optionAll.id;
    }

    this.setState({ filters: toUpdate });

    const { onFiltersChange } = this.props;
    const updatedFilters = { ...toUpdate };

    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === optionAll.id) {
        updatedFilters[key] = undefined;
      }
    });

    onFiltersChange(updatedFilters);
  };
  render() {
    const { classes, users } = this.props;
    const { byUser, source } = this.state.filters;
    const resource = this.getResource();

    return (
      <form className={classes.root} autoComplete="off">
        {this.getResourceTypeFilter()}
        {this.getResourceIdFilter()}
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="byUser">Select User</InputLabel>
          <Select
            inputProps={{
              name: 'byUser',
              id: 'byUser',
            }}
            onChange={this.handleChange}
            value={byUser}>
            <MenuItem key={optionAll.id} value={optionAll.id}>
              All
            </MenuItem>
            {users.map(opt => (
              <MenuItem key={opt._id} value={opt._id}>
                {opt.name || opt.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="source">Select Source</InputLabel>
          <Select
            inputProps={{
              name: 'source',
              id: 'source',
            }}
            onChange={this.handleChange}
            value={source}>
            {[
              [optionAll.id, optionAll.label],
              ...Object.keys(AUDIT_LOG_SOURCE_LABELS)
                .filter(k => {
                  if (!resource) {
                    return true;
                  }

                  if (resource._connectorId) {
                    return k !== 'stack';
                  }

                  return k !== 'connector';
                })
                .map(k => [k, AUDIT_LOG_SOURCE_LABELS[k]]),
            ].map(opt => (
              <MenuItem key={opt[0]} value={opt[0]}>
                {opt[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Filters);
