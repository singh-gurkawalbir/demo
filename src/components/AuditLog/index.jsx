import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import Filters from './Filters';
import AuditLogTable from './AuditLogTable';

const mapStateToProps = state => {
  const resourceDetails = selectors.resourceDetailsMap(state);

  return {
    resourceDetails,
  };
};

const mapDispatchToProps = dispatch => ({
  clearAuditLogs: () => {
    dispatch(actions.auditLogs.clear());
  },
  requestAuditLogs: (resourceType, resourceId) => {
    dispatch(actions.auditLogs.request(resourceType, resourceId));
  },
});

@withStyles(theme => ({
  root: {
    width: '98%',
    wordBreak: 'break-word',
  },
  title: {
    marginBottom: theme.spacing(2),
    float: 'left',
  },
}))
class AuditLog extends Component {
  state = {
    filters: {},
  };

  componentDidMount() {
    const {
      clearAuditLogs,
      requestAuditLogs,
      resourceType,
      resourceId,
    } = this.props;

    clearAuditLogs();
    requestAuditLogs(resourceType, resourceId);
  }

  handleFiltersChange = filters => {
    this.setState({ filters });
  };

  render() {
    const {
      classes,
      className,
      resourceDetails,
      affectedResources,
      users,
      resourceType,
      resourceId,
      onClick,
      childId,
    } = this.props;
    const { filters } = this.state;

    return (
      <LoadResources
        required
        resources="integrations, flows, exports, imports, connections">
        <>
          <div className={(classes.root, className)}>
            <Filters
              affectedResources={affectedResources}
              resourceDetails={resourceDetails}
              users={users}
              onFiltersChange={this.handleFiltersChange}
              resourceType={resourceType}
              resourceId={resourceId}
            />
            <AuditLogTable
              resourceType={resourceType}
              resourceId={resourceId}
              filters={filters}
              childId={childId}
              onClick={onClick}
            />
          </div>
        </>
      </LoadResources>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditLog);
