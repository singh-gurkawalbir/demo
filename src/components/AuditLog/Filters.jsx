import { Component } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core';
import { sortBy } from 'lodash';
import {
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_SINGULAR_TO_PLURAL,
} from '../../constants/resource';
import { AUDIT_LOG_SOURCE_LABELS, OPTION_ALL } from './util';
import * as selectors from '../../reducers';
import { ResourceTypeFilter, ResourceIdFilter } from './ResourceFilters';
import CeligoSelect from '../CeligoSelect';

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
    marginRight: theme.spacing(1),
    minWidth: 150,
    maxWidth: theme.spacing(30),
    height: 36,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filterWrapper: {
    padding: 0,
  },
}))
class Filters extends Component {
  state = {
    filters: {
      resourceType: OPTION_ALL.id,
      _resourceId: OPTION_ALL.id,
      byUser: OPTION_ALL.id,
      source: OPTION_ALL.id,
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

  getResourceIdFilter = () => {
    const { filters } = this.state;
    const {
      classes,
      affectedResources,
      resourceDetails,
      resourceType,
    } = this.props;
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
        if (resourceDetails[filterResourceType])
          options.push({
            id: ar,
            name:
              resourceDetails[filterResourceType][ar] &&
              resourceDetails[filterResourceType][ar].name,
          });
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
          value={filters._resourceId}
          onChange={this.handleChange}>
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
  };
  handleChange = event => {
    const { filters } = this.state;
    const toUpdate = { ...filters, [event.target.name]: event.target.value };

    if (event.target.name === 'resourceType') {
      toUpdate._resourceId = OPTION_ALL.id;
    }

    this.setState({ filters: toUpdate });

    const { onFiltersChange } = this.props;
    const updatedFilters = { ...toUpdate };

    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === OPTION_ALL.id) {
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
      <div className={classes.filterWrapper}>
        <form className={classes.root} autoComplete="off">
          <ResourceTypeFilter
            {...this.props}
            filters={this.state.filters}
            onChange={this.handleChange}
          />
          <ResourceIdFilter
            {...this.props}
            filters={this.state.filters}
            onChange={this.handleChange}
          />
          <FormControl className={classes.formControl}>
            <CeligoSelect
              inputProps={{
                name: 'byUser',
                id: 'byUser',
              }}
              onChange={this.handleChange}
              value={byUser}>
              <MenuItem value="select user" disabled>
                Select user
              </MenuItem>
              <MenuItem key={OPTION_ALL.id} value={OPTION_ALL.id}>
                All
              </MenuItem>
              {users.map(opt => (
                <MenuItem key={opt._id} value={opt._id}>
                  {opt.name || opt.email}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <CeligoSelect
              inputProps={{
                name: 'source',
                id: 'source',
              }}
              onChange={this.handleChange}
              value={source}>
              <MenuItem value="" disabled>
                Select source
              </MenuItem>
              {[
                [OPTION_ALL.id, OPTION_ALL.label],
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
            </CeligoSelect>
          </FormControl>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Filters);
