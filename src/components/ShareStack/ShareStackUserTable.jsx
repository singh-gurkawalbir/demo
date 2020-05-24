import {
  makeStyles,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@material-ui/core';
import ShareStackUserDetail from './ShareStackUserDetail';

const useStyles = makeStyles(theme => ({
  root: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    overflowX: 'auto',
  },
  table: {
    paddingTop: theme.spacing(1),
  },
}));

export default function ShareStackUserTable({ stackShareCollection }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Enable user</TableCell>
            <TableCell>Action</TableCell>
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
