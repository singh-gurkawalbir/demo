import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import getRoutePath from '../../utils/routePaths';
import DiffDialog from './DiffDialog';
import Filters from './Filters';

const mapStateToProps = (state, { resourceType, resourceId }) => {
  const preferences = selectors.userProfilePreferencesProps(state);
  const audits = selectors.auditLogs(state, resourceType, resourceId);
  const auditLogs = [];
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

  if (audits && audits.length > 0) {
    audits.forEach(a => {
      if (a.fieldChanges && a.fieldChanges.length > 0) {
        a.fieldChanges.forEach(fc => {
          auditLogs.push({ ...a, fieldChanges: undefined, fieldChange: fc });
        });
      } else {
        auditLogs.push({ ...a, fieldChange: {} });
      }
    });
  }

  const resourceTypes = [
    'integrations',
    'flows',
    'exports',
    'imports',
    'connections',
  ];
  const resourceTypeMap = {
    integrations: 'integration',
    flows: 'flow',
    exports: 'export',
    imports: 'import',
    connections: 'connection',
  };
  const resources = {};

  resourceTypes.forEach(rt => {
    const resourceList = selectors.resourceList(state, {
      type: rt,
    }).resources;

    resources[resourceTypeMap[rt]] = {};
    resourceList.forEach(r => {
      resources[resourceTypeMap[rt]][r._id] = {
        name: r.name,
      };

      if (rt === 'flows') {
        resources[resourceTypeMap[rt]][r._id]._integrationId = r._integrationId;
      }
    });
  });

  return {
    preferences,
    auditLogs,
    resources,
    affectedResources,
    usersFromAudit,
  };
};

const mapDispatchToProps = dispatch => ({
  clearAuditLogs: () => {
    dispatch(actions.clearAuditLogs());
  },
  requestAuditLogs: (resourceType, resourceId) => {
    if (resourceType && resourceId) {
      dispatch(
        actions.resource.requestCollection(
          [resourceType, resourceId, 'audit'].join('/')
        )
      );
    } else {
      dispatch(actions.resource.requestCollection('audit'));
    }
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
  inviteUserButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
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
    selectedLog: undefined,
    showDiffDialog: false,
    rowsPerPage: 10,
    page: 0,
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

  getResourceUrl(resourceType, resourceId, options = {}) {
    switch (resourceType) {
      case 'accesstoken':
        return `/tokens?_id=${resourceId}`;
      case 'connection':
        return `/connections?_id=${resourceId}`;
      case 'export':
        return `/exports/${resourceId}/edit`;
      case 'flow':
        return `/integrations/${options._integrationId ||
          'none'}/settings/flows/${resourceId}/edit`;
      case 'import':
        return `/imports/${resourceId}/edit`;
      case 'integration':
        return `/integrations/${resourceId}/settings/flows`;
      case 'stack':
        return `/stacks/${resourceId}/edit`;
      default:
    }
  }

  canShowOldValueAndNewValue(oldValue, newValue) {
    if (
      (oldValue &&
        typeof oldValue === 'object' &&
        JSON.stringify(oldValue).length > 10) ||
      (newValue &&
        typeof newValue === 'object' &&
        JSON.stringify(newValue).length > 10)
    ) {
      return false;
    } else if (
      (oldValue && typeof oldValue === 'string' && oldValue.length > 300) ||
      (newValue && typeof newValue === 'string' && newValue.length > 300)
    ) {
      return false;
    }

    return true;
  }

  handleFiltersChange = filters => {
    this.setState({ filters, page: 0 });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  render() {
    const {
      classes,
      auditLogs,
      preferences,
      resources,
      affectedResources,
      usersFromAudit,
      resourceType,
    } = this.props;
    const {
      filters,
      showDiffDialog,
      selectedLog,
      rowsPerPage,
      page,
    } = this.state;
    const filteredLogs = auditLogs.filter(al => {
      if (filters.resourceType && filters.resourceType !== al.resourceType) {
        return false;
      }

      if (filters._resourceId && filters._resourceId !== al._resourceId) {
        return false;
      }

      if (filters.byUser && filters.byUser !== al.byUser._id) {
        return false;
      }

      if (filters.source && filters.source !== al.source) {
        return false;
      }

      return true;
    });
    const auditLogsInCurrentPage = filteredLogs.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    return (
      <LoadResources
        resources={[
          'integrations',
          'flows',
          'exports',
          'imports',
          'connections',
        ]}
        required>
        <Fragment>
          {showDiffDialog && (
            <DiffDialog
              auditLog={selectedLog}
              onCancelClick={() => {
                this.setState({
                  showDiffDialog: false,
                  selectedLog: undefined,
                });
              }}
            />
          )}
          <div className={classes.root}>
            <Typography className={classes.title} variant="h4">
              Audit Log
            </Typography>
            <Filters
              affectedResources={affectedResources}
              resources={resources}
              users={usersFromAudit}
              onFiltersChange={this.handleFiltersChange}
              isIntegrationLevelAudit={resourceType === 'integrations'}
            />
            <TablePagination
              classes={{ root: classes.tablePaginationRoot }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.columnTime}>Time</TableCell>
                  <TableCell className={classes.columnSource}>Source</TableCell>
                  <TableCell className={classes.columnUser}>User</TableCell>
                  <TableCell className={classes.columnResourceType}>
                    Resource
                  </TableCell>
                  <TableCell className={classes.columnResourceName}>
                    Name/Id
                  </TableCell>
                  <TableCell className={classes.columnAction}>Action</TableCell>
                  <TableCell className={classes.columnField}>Field</TableCell>
                  <TableCell className={classes.columnOldValue}>
                    Old Value
                  </TableCell>
                  <TableCell className={classes.columnNewValue}>
                    New Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogsInCurrentPage &&
                  auditLogsInCurrentPage.map(al => (
                    <TableRow
                      key={[
                        al._id,
                        al.fieldChange && al.fieldChange.fieldPath,
                      ].join('_')}>
                      <TableCell>
                        {moment(al.time).format(preferences.dateFormat)}{' '}
                        {moment(al.time).format(preferences.timeFormat)}
                      </TableCell>
                      <TableCell>
                        {
                          {
                            api: 'API',
                            stack: 'Stack',
                            system: 'System',
                            ui: 'UI',
                          }[al.source]
                        }
                      </TableCell>
                      <TableCell>
                        {al.byUser && (al.byUser.name || al.byUser.email)}
                      </TableCell>
                      <TableCell>
                        {
                          {
                            asynchelper: 'Async Helper',
                            connection: 'Connection',
                            export: 'Export',
                            filedefinition: 'File Definitions',
                            flow: 'Flow',
                            import: 'Import',
                            integration: 'Integration',
                            stack: 'Stack',
                          }[al.resourceType]
                        }
                      </TableCell>
                      <TableCell>
                        {al.event === 'delete' &&
                          al.deletedInfo &&
                          al.deletedInfo.name}
                        {al.event !== 'delete' && (
                          <Link
                            to={getRoutePath(
                              this.getResourceUrl(
                                al.resourceType,
                                al._resourceId,
                                {
                                  _integrationId:
                                    resources[al.resourceType] &&
                                    resources[al.resourceType][
                                      al._resourceId
                                    ] &&
                                    resources[al.resourceType][al._resourceId]
                                      ._integrationId,
                                }
                              )
                            )}>
                            {(resources[al.resourceType] &&
                              resources[al.resourceType][al._resourceId] &&
                              resources[al.resourceType][al._resourceId]
                                .name) ||
                              `${al._resourceId}`}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        {
                          {
                            create: 'Create',
                            delete: 'Delete',
                            update: 'Update',
                            view: 'View',
                          }[al.event]
                        }
                      </TableCell>
                      <TableCell>
                        {al.fieldChange && al.fieldChange.fieldPath}
                      </TableCell>
                      <Fragment>
                        {this.canShowOldValueAndNewValue(
                          al.fieldChange.oldValue,
                          al.fieldChange.newValue
                        ) ? (
                          <Fragment>
                            <TableCell>
                              {typeof al.fieldChange.oldValue === 'string'
                                ? al.fieldChange.oldValue
                                : JSON.stringify(al.fieldChange.oldValue)}
                            </TableCell>
                            <TableCell>
                              {al.fieldChange &&
                              typeof al.fieldChange.newValue === 'string'
                                ? al.fieldChange.newValue
                                : JSON.stringify(al.fieldChange.newValue)}
                            </TableCell>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  this.setState({
                                    showDiffDialog: true,
                                    selectedLog: al,
                                  });
                                }}>
                                Click to view
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  this.setState({
                                    showDiffDialog: true,
                                    selectedLog: al,
                                  });
                                }}>
                                Click to view
                              </Button>
                            </TableCell>
                          </Fragment>
                        )}
                      </Fragment>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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
