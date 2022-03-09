import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';

import CeligoSelect from '../../../../../../../components/CeligoSelect';
import useFetchIntegrationUsers from '../../../../../../../hooks/useFetchIntegrationUsers';
import actions from '../../../../../../../actions';
import { selectors } from '../../../../../../../reducers';
import { getRevisionFilterKey, DEFAULT_OPTION } from '../../../../../../../utils/revisions';

export default function UserFilter() {
  const { integrationId } = useParams();
  const dispatch = useDispatch();
  const filterKey = getRevisionFilterKey(integrationId);
  const integrationUsers = useFetchIntegrationUsers(integrationId);
  const selectedUser = useSelector(state => {
    const revisionFilter = selectors.filter(state, filterKey);

    return revisionFilter?.user;
  });
  const handleUserFilter = useCallback(
    e => {
      dispatch(actions.patchFilter(filterKey, { user: e.target.value }));
    },
    [dispatch, filterKey],
  );

  return (
    <CeligoSelect
    //   isLoggable={false}
      onChange={handleUserFilter}
      value={selectedUser}>
      <MenuItem key={DEFAULT_OPTION} value={DEFAULT_OPTION}>
        Select user
      </MenuItem>
      {
        integrationUsers.map(user => (
          <MenuItem key={user.sharedWithUser._id} value={user.sharedWithUser._id} data-private>
            {user.sharedWithUser.name || user.sharedWithUser.email}
          </MenuItem>
        ))
      }
    </CeligoSelect>
  );
}
