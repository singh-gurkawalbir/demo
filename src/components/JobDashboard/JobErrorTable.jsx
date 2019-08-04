import { useState, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
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
});

function JobErrorTable({ classes, rowsPerPage = 10, jobErrors }) {
  const [currentPage, setCurrentPage] = useState(0);
  const jobErrorsInCurrentPage = jobErrors.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  function handleChangePage(event, newPage) {
    setCurrentPage(newPage);
  }

  return (
    <Fragment>
      <TablePagination
        classes={{ root: classes.tablePaginationRoot }}
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={jobErrors.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={handleChangePage}
        // onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />

      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                disabled={jobErrors.length === 0}
                inputProps={{ 'aria-label': 'Select all errors' }}
              />
            </TableCell>
            <TableCell>Resolved?</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Retry Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobErrorsInCurrentPage.map(jobError => (
            <TableRow key={jobError._id}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>{jobError.resolved ? 'Yes' : 'No'}</TableCell>
              <TableCell>{jobError.source}</TableCell>
              <TableCell>{jobError.code}</TableCell>
              <TableCell>{jobError.message}</TableCell>
              <TableCell>{jobError.createdAt}</TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default withStyles(styles)(JobErrorTable);
