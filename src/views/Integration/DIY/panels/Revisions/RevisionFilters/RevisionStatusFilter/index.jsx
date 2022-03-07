import React, { useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CeligoSelect from '../../../../../../../components/CeligoSelect';
import { REVISION_STATUS_OPTIONS, getRevisionFilterKey, DEFAULT_OPTION } from '../../../../../../../utils/revisions';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';

export default function RevisionStatusFilter() {
  const dispatch = useDispatch();
  const { integrationId } = useParams();
  const filterKey = getRevisionFilterKey(integrationId);

  const statusFilter = useSelector(state => selectors.filter(state, filterKey)?.status);
  const handleStatusFilter = useCallback(e => {
    dispatch(actions.patchFilter(filterKey, { status: e.target.value }));
  }, [dispatch, filterKey]);

  return (
    <CeligoSelect
      isLoggable={false}
      onChange={handleStatusFilter}
      value={statusFilter}>
      <MenuItem key={DEFAULT_OPTION} value={DEFAULT_OPTION}>
        Select status
      </MenuItem>
      {REVISION_STATUS_OPTIONS.map(opt => (
        <MenuItem key={opt.value} value={opt.value} data-private>
          {opt.label}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
