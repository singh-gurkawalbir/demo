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
import * as selectors from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import actions from '../../../actions';
import SharedUserRow from './SharedUserRow';

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

export default function SharedUserList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { stackId } = match.params;
  // TODO: Move this logic to a single selector
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

  // TODO Copied existing logic. Check if we need this.
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
              <SharedUserRow key={user._id} user={user} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
