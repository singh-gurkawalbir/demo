import { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core';
import * as _ from 'lodash';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../utils/constants';

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
export default class Filters extends Component {
  state = {
    resourceType: 'all',
    _resourceId: 'all',
    byUser: 'all',
    source: 'all',
  };
  getResourceIdFilter = () => {
    const { resourceType, _resourceId } = this.state;
    const {
      classes,
      affectedResources,
      resources,
      isIntegrationLevelAudit,
    } = this.props;

    if (
      !resourceType ||
      resourceType === 'all' ||
      (resourceType === 'integration' && isIntegrationLevelAudit)
    ) {
      return null;
    }

    let options = [];

    affectedResources[resourceType] &&
      affectedResources[resourceType].forEach(ar => {
        options.push({
          id: ar,
          name:
            resources[resourceType] &&
            resources[resourceType][ar] &&
            resources[resourceType][ar].name,
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
          Select {RESOURCE_TYPE_SINGULAR_TO_LABEL[resourceType]}
        </InputLabel>
        <Select
          inputProps={{
            name: '_resourceId',
            id: '_resourceId',
          }}
          value={_resourceId}
          onChange={this.handleChange}>
          <MenuItem key="all" value="all">
            All
          </MenuItem>
          {menuOptions}
        </Select>
      </FormControl>
    );
  };
  handleChange = event => {
    const toUpdate = { [event.target.name]: event.target.value };

    if (event.target.name === 'resourceType') {
      toUpdate._resourceId = 'all';
    }

    this.setState(toUpdate);

    const { onFiltersChange } = this.props;
    const filters = { ...toUpdate };

    ['resourceType', '_resourceId', 'byUser', 'source'].forEach(key => {
      if (!filters[key]) {
        filters[key] = this.state[key];
      }

      if (filters[key] === 'all') {
        filters[key] = undefined;
      }
    });

    onFiltersChange(filters);
  };
  render() {
    const { classes, users } = this.props;
    const { resourceType, byUser, source } = this.state;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="resourceType">Select Resource Type</InputLabel>
          <Select
            value={resourceType}
            onChange={this.handleChange}
            inputProps={{
              name: 'resourceType',
              id: 'resourceType',
            }}>
            {[
              ['all', 'All'],
              ['integration', 'Integration'],
              ['flow', 'Flow'],
              ['import', 'Import'],
              ['export', 'Export'],
              ['connection', 'Connection'],
              ['stack', 'Stack'],
              ['asynchelper', 'Asynchelper'],
              ['filedefinition', 'File Definitions'],
            ].map(opt => (
              <MenuItem key={opt[0]} value={opt[0]}>
                {opt[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            <MenuItem key="all" value="all">
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
              ['all', 'All'],
              ['ui', 'UI'],
              ['api', 'API'],
              ['stack', 'Stack'],
              ['system', 'System'],
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
