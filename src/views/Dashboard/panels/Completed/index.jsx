import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import JobDashboard from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import LoadResources from '../../../../components/LoadResources';
import actions from '../../../../actions';
import {FILTER_KEYS_AD} from '../../../../utils/accountDashboard';

const defaultFilter = {
  sort: { order: 'desc', orderBy: 'createdAt' },
  paging: {
    rowsPerPage: 50,
    currPage: 0,
  },
};

export default function DashboardPanel() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEYS_AD.COMPLETED, {...defaultFilter }));
  }, [dispatch]);

  return (
    <LoadResources required resources="flows,integrations">

      <JobDashboard />
    </LoadResources>
  );
}
