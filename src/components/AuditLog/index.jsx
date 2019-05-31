import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import Filters from './Filters';
import AuditLogsTable from './AuditLogsTable';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../utils/constants';

const resourceTypes = [
  'integrations',
  'flows',
  'exports',
  'imports',
  'connections',
];
const mapStateToProps = (state, { resourceType, resourceId }) => {
  const auditLogs = selectors.auditLogs(state, resourceType, resourceId);
  const affectedResources = selectors.affectedResourcesFromAuditLogs(
    state,
    resourceType,
    resourceId
  );
  const usersFromAudit = selectors.usersFromAuditLogs(
    state,
    resourceType,
    resourceId
  );
  const resourceDetails = {};

  resourceTypes.forEach(rt => {
    const resourceList = selectors.resourceList(state, {
      type: rt,
    }).resources;

    resourceDetails[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]] = {};
    resourceList.forEach(r => {
      resourceDetails[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]][r._id] = {
        name: r.name,
      };

      if (rt === 'flows') {
        resourceDetails[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]][
          r._id
        ]._integrationId = r._integrationId;
      }
    });
  });

  return {
    auditLogs,
    resourceDetails,
    affectedResources,
    usersFromAudit,
  };
};

const mapDispatchToProps = dispatch => ({
  clearAuditLogs: () => {
    dispatch(actions.auditLogs.clear());
  },
  requestAuditLogs: (resourceType, resourceId) => {
    dispatch(actions.auditLogs.requestCollection(resourceType, resourceId));
  },
});

@withStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  table: {
    minWidth: 700,
  },
  tablePaginationRoot: { float: 'left' },
  columnTime: { minWidth: 230 },
  columnSource: { minWidth: 125 },
  columnUser: { minWidth: 200 },
  columnResourceType: { minWidth: 220 },
  columnResourceName: { minWidth: 240 },
  columnAction: { minWidth: 100 },
  columnField: { minWidth: 270 },
  columnOldValue: { minWidth: 330 },
  columnNewValue: { minWidth: 330 },
}))
class AuditLog extends Component {
  state = {
    filters: {},
  };
  componentWillMount() {
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
      usersFromAudit,
      resourceType,
      resourceId,
    } = this.props;
    const { filters } = this.state;

    return (
      <LoadResources resources={resourceTypes} required>
        <Fragment>
          <div className={classes.root}>
            <Typography className={classes.title} variant="h4">
              Audit Log
            </Typography>
            <Filters
              affectedResources={affectedResources}
              resourceDetails={resourceDetails}
              users={usersFromAudit}
              onFiltersChange={this.handleFiltersChange}
              isIntegrationLevelAudit={resourceType === 'integrations'}
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

export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuditLog)
);
