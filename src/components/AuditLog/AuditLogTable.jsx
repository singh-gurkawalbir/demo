import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import * as selectors from '../../reducers';
import CeligoTable from '../../components/CeligoTable';
import metadata from './metadata';

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
    marginLeft: theme.spacing(1),
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
  textAlignCenter: { textAlign: 'center' },
}))
class AuditLogTable extends Component {
  state = {
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
    const { classes, auditLogs } = this.props;
    const { rowsPerPage, page } = this.state;
    const auditLogsInCurrentPage =
      auditLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage) || [];

    return (
      <Fragment>
        <div className={classes.root}>
          <TablePagination
            classes={{ root: classes.tablePaginationRoot }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={auditLogs.length}
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
          <CeligoTable
            data={auditLogsInCurrentPage}
            {...metadata}
            actionProps={{ ...this.props }}
          />
        </div>
      </Fragment>
    );
  }
}

export default withSnackbar(
  connect(
    mapStateToProps,
    null
  )(AuditLogTable)
);
