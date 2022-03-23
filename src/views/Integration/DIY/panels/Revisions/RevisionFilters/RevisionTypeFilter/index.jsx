import React, { useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CeligoSelect from '../../../../../../../components/CeligoSelect';
import { REVISION_TYPE_OPTIONS, getRevisionFilterKey, DEFAULT_OPTION } from '../../../../../../../utils/revisions';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';

export default function RevisionTypeFilter() {
  const dispatch = useDispatch();
  const { integrationId } = useParams();
  const filterKey = getRevisionFilterKey(integrationId);

  const typeFilter = useSelector(state => selectors.filter(state, filterKey)?.type);
  const handleTypeFilter = useCallback(e => {
    dispatch(actions.patchFilter(filterKey, { type: e.target.value }));
  }, [dispatch, filterKey]);

  return (
    <CeligoSelect
      onChange={handleTypeFilter}
      value={typeFilter}>
      <MenuItem key={DEFAULT_OPTION} value={DEFAULT_OPTION}>
        Select type
      </MenuItem>
      {REVISION_TYPE_OPTIONS.map(opt => (
        <MenuItem key={opt.value} value={opt.value} data-private>
          {opt.label}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
