import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import Filters from './Filters';
import AuditLogsTable from './AuditLogsTable';

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
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
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
      resourceDetails,
      affectedResources,
      users,
      resourceType,
      resourceId,
    } = this.props;
    const { filters } = this.state;

    return (
      <LoadResources
        required
        resources="integrations, flows, exports, imports, connections">
        <Fragment>
          <div className={classes.root}>
            <Typography className={classes.title} variant="h4">
              Audit Log
            </Typography>
            <Filters
              affectedResources={affectedResources}
              resourceDetails={resourceDetails}
              users={users}
              onFiltersChange={this.handleFiltersChange}
              resourceType={resourceType}
              resourceId={resourceId}
            />
            <AuditLogsTable
              resourceType={resourceType}
              resourceId={resourceId}
              resourceDetails={resourceDetails}
              filters={filters}
            />
          </div>
        </Fragment>
      </LoadResources>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditLog);
