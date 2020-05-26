import { useRouteMatch } from 'react-router-dom';
import {
  makeStyles,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';
import ShareStackUserDetail from './ShareStackUserDetail';
import * as selectors from '../../reducers';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    overflowX: 'auto',
  },
  table: {
    paddingTop: theme.spacing(1),
  },
}));
const ssharesFilterConfig = { type: 'sshares' };

export default function ShareStackUserTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { stackId } = match.params;
  const resourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    ssharesFilterConfig
  );
  const stackShareCollectionById = useMemo(
    () =>
      resourceList.resources &&
      resourceList.resources.filter(stack => stack._stackId === stackId),
    [resourceList.resources, stackId]
  );

  useEffect(() => {
    dispatch(actions.resource.requestCollection('sshares'));
  }, [dispatch]);

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
          {stackShareCollectionById &&
            stackShareCollectionById.map(user => (
              <ShareStackUserDetail key={user._id} user={user} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
