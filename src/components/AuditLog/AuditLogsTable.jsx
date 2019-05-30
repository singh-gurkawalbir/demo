import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
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
import LoadResources from '../LoadResources';
import DiffDialog from './DiffDialog';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../utils/constants';
import getResourcePagePath from '../../utils/resource';
import showViewDiffLink from '../../utils/auditLog';

const mapStateToProps = (state, { resourceType, resourceId, filters }) => {
  const preferences = selectors.userProfilePreferencesProps(state);
  const auditLogs = selectors.auditLogs(
    state,
    resourceType,
    resourceId,
    filters
  );

  return {
    preferences,
    auditLogs,
  };
};

@withStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
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
class AuditLogsTable extends Component {
  state = {
    selectedLog: undefined,
    showDiffDialog: false,
    page: 0,
    rowsPerPage: 10,
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  render() {
    const { classes, auditLogs, preferences, resources } = this.props;
    const { showDiffDialog, selectedLog, rowsPerPage, page } = this.state;
    const expandedLogs = [];

    auditLogs.forEach(a => {
      if (a.fieldChanges && a.fieldChanges.length > 0) {
        a.fieldChanges.forEach(fc => {
          expandedLogs.push({ ...a, fieldChanges: undefined, fieldChange: fc });
        });
      } else {
        expandedLogs.push({ ...a, fieldChange: {} });
      }
    });

    const auditLogsInCurrentPage = expandedLogs.slice(
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
            <TablePagination
              classes={{ root: classes.tablePaginationRoot }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={expandedLogs.length}
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
                        {RESOURCE_TYPE_SINGULAR_TO_LABEL[al.resourceType]}
                      </TableCell>
                      <TableCell>
                        {al.event === 'delete' &&
                          al.deletedInfo &&
                          al.deletedInfo.name}
                        {al.event !== 'delete' && (
                          <Link
                            to={getResourcePagePath(
                              al.resourceType,
                              al._resourceId,
                              {
                                _integrationId:
                                  resources[al.resourceType] &&
                                  resources[al.resourceType][al._resourceId] &&
                                  resources[al.resourceType][al._resourceId]
                                    ._integrationId,
                              }
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
                        {showViewDiffLink(
                          al.fieldChange.oldValue,
                          al.fieldChange.newValue
                        ) ? (
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
                        ) : (
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
    null
  )(AuditLogsTable)
);
