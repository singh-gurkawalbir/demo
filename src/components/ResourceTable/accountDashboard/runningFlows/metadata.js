import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../auditLog/cells/Name';
import JobStatus from '../../../JobDashboard/JobStatus';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import { getPages, getSuccess } from '../../../../utils/jobdashboard';
import Cancel from './actions/Cancel';
import MultiSelectParentChildColumnFilter from '../../commonCells/MultiSelectParentChildColumnFilter';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

export default {
  useColumns: () => [
    {
      key: 'integrationName',
      HeaderValue: function IntegrationSearchFilter() {
        const dispatch = useDispatch();
        const integrationOptions = useSelector(state => selectors.getAllIntegrations(state));
        const handleSave = useCallback(
          () => {
            dispatch(actions.patchFilter('runningFlows', {
              flowIds: ['all'],
            }));
          },
          [dispatch],
        );

        return (
          <MultiSelectParentChildColumnFilter
            title="Integration"
            filterBy="integrationIds"
            filterKey="runningFlows"
            handleSave={handleSave}
            options={integrationOptions.map(({ _id, name, children}) => ({_id, name, children }))} />
        );
      },
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'integration', _resourceId: al._integrationId}} actionProps={tableContext} />;
      },
    },
    {
      key: 'flowName',
      HeaderValue: function FlowSearchFilter() {
        const flowOptions = useSelector(state => selectors.getAllFlows(state));

        return (
          <MultiSelectColumnFilter
            title="Flow"
            filterBy="flowIds"
            filterKey="runningFlows"
            options={flowOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'flow', _resourceId: al._flowId}} actionProps={tableContext} />;
      },
      width: '10%',
    },
    {
      key: 'status',
      heading: 'Status',
      HeaderValue: function FlowSearchFilter() {
        const statusOptions = [{_id: 'all', name: 'All status'},
          {_id: 'running', name: 'In progress'},
          {_id: 'canceling', name: 'Canceling'},
          {_id: 'queued', name: 'Queued'}];

        return (
          <MultiSelectColumnFilter
            title="Status"
            filterBy="status"
            filterKey="runningFlows"
            options={statusOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: ({rowData: al}) => <JobStatus job={al} />,
      width: '10%',
    },
    {
      key: 'started',
      heading: 'Started',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.startedAt} />,
      orderBy: 'started',
      width: '10%',
    },
    {
      key: 'success',
      heading: 'Success',
      Value: ({rowData: r}) => getSuccess(r) || 0,
      width: '10%',
    },
    {
      key: 'ignore',
      heading: 'Ignore',
      Value: ({rowData: r}) => r.numIgnore || 0,
      width: '10%',
    },
    {
      key: 'errors',
      heading: 'Errors',
      Value: ({rowData: r}) => r.numError || 0,
      width: '10%',
    },
    {
      key: 'resolved',
      heading: 'Resolved',
      Value: ({rowData: r}) => r.numResolved || 0,
      width: '10%',
    },
    {
      key: 'pages',
      heading: 'Pages',
      Value: ({rowData: r}) => getPages(r) || 0,
      width: '10%',
    },
  ],
  useRowActions: () =>
    [Cancel],
};
