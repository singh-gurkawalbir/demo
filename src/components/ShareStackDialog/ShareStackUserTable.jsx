import { useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';
import ShareStackUserDetail from './ShareStackUserDetail';
import actions from '../../actions';

const styles = theme => ({
  root: {
    width: '98%',
    marginLeft: theme.spacing(1),
    overflowX: 'auto',
  },
  refreshIcon: {
    marginLeft: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(3),
  },
});

function ShareStackUserTable(props) {
  const { classes, stackShareCollection } = props;
  const dispatch = useDispatch();
  const handleRefreshClick = () =>
    dispatch(actions.stack.requestStackShareCollection());

  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Currently Shared With</TableCell>
            <TableCell>
              Status
              <RefreshIcon
                className={classes.refreshIcon}
                onClick={handleRefreshClick}
              />
            </TableCell>
            <TableCell>Off/On</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stackShareCollection &&
            stackShareCollection.map(user => (
              <ShareStackUserDetail key={user._id} user={user} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withStyles(styles)(ShareStackUserTable);
