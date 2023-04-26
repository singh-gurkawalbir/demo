import { useRouteMatch } from 'react-router-dom';
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import React, { useMemo, useEffect } from 'react';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import actions from '../../../actions';
import SharedUserRow from './SharedUserRow';

const ssharesFilterConfig = { type: 'sshares' };

export default function SharedUserList() {
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

  // TODO: For consistent look and feel,
  // this should be converted to a CeligoTable.. no?
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Off/On</TableCell>
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
  );
}
