import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import JobDashboard from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import LoadResources from '../../../../components/LoadResources';
import actions from '../../../../actions';

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
    dispatch(actions.patchFilter('completedFlows', {...defaultFilter }));
  }, [dispatch]);

  return (
    <LoadResources required resources="flows,integrations">

      <JobDashboard />
    </LoadResources>
  );
}
