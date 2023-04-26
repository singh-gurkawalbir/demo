import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
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

  const usersList = useSelector(state => {
    const uniqUserIds = selectors.uniqueUserIdsFromRevisions(state, integrationId);

    return uniqUserIds.map(userId => {
      const userObj = integrationUsers.find(user => user.sharedWithUser._id === userId);

      if (!userObj) return { id: userId, name: userId};

      return {
        id: userId,
        name: userObj.sharedWithUser.name || userObj.sharedWithUser.email,
      };
    });
  });

  const selectedUser = useSelector(state => {
    const revisionFilter = selectors.filter(state, filterKey);

    return revisionFilter?.user;
  });

  const revisionsPagingFilter = useSelector(state =>
    selectors.filter(state, filterKey)?.paging,
  shallowEqual);

  const handleUserFilter = useCallback(
    e => {
      dispatch(actions.patchFilter(filterKey, { user: e.target.value,
        paging: {
          ...revisionsPagingFilter,
          currPage: 0,
        } }));
    },
    [dispatch, filterKey, revisionsPagingFilter],
  );

  return (
    <CeligoSelect onChange={handleUserFilter} value={selectedUser}>
      <MenuItem key={DEFAULT_OPTION} value={DEFAULT_OPTION}>
        Select user
      </MenuItem>
      {
        usersList.map(user => (
          <MenuItem key={user.id} value={user.id} data-private>
            {user.name}
          </MenuItem>
        ))
      }
    </CeligoSelect>
  );
}
