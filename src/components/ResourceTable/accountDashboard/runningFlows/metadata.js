import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../commonCells/Name';
import JobStatus from '../../../JobDashboard/JobStatus';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import { getPages, getSuccess } from '../../../../utils/jobdashboard';
import Cancel from './actions/Cancel';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, RUNNNING_STATUS_OPTIONS} from '../../../../utils/accountDashboard';

export default {
  useColumns: () => [
    {
      key: 'integrationName',
      HeaderValue: function IntegrationSearchFilter() {
        const dispatch = useDispatch();
        const integrationOptions = useSelector(state => selectors.getAllAccountDashboardIntegrations(state));
        const handleSave = useCallback(
          () => {
            dispatch(actions.patchFilter(FILTER_KEYS_AD.RUNNING, {
              flowIds: ['all'],
            }));
          },
          [dispatch],
        );

        return (
          <MultiSelectColumnFilter
            title="Integration"
            filterBy="integrationIds"
            filterKey="runningFlows"
            handleSave={handleSave}
            options={integrationOptions.map(({ _id, name, children}) => ({_id, name, children }))} />
        );
      },
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'integration', _resourceId: al._integrationId || 'none'}} actionProps={tableContext} />;
      },
    },
    {
      key: 'flowName',
      HeaderValue: function FlowSearchFilter() {
        const flowOptions = useSelector(state => selectors.getAllAccountDashboardFlows(state, FILTER_KEYS_AD.RUNNING));

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
        return (
          <MultiSelectColumnFilter
            title="Status"
            filterBy="status"
            filterKey="runningFlows"
            options={RUNNNING_STATUS_OPTIONS.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: ({rowData: al}) => <JobStatus job={al} />,
      width: '10%',
    },
    {
      key: 'startedAt',
      heading: 'Started',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.startedAt} />,
      orderBy: 'startedAt',
      width: '10%',
    },
    {
      key: 'numSuccess',
      heading: 'Success',
      Value: ({rowData: r}) => getSuccess(r),
      width: '10%',
      orderBy: 'numSuccess',
    },
    {
      key: 'numIgnore',
      heading: 'Ignored',
      Value: ({rowData: r}) => r.numIgnore,
      width: '10%',
      orderBy: 'numIgnore',
    },
    {
      key: 'numError',
      heading: 'Errors',
      Value: ({rowData: r}) => r.numError,
      width: '10%',
      orderBy: 'numError',
    },
    {
      key: 'numResolved',
      heading: 'Auto-resolved',
      Value: ({rowData: r}) => r.numResolved,
      width: '10%',
      orderBy: 'numResolved',
    },
    {
      key: 'numPagesGenerated',
      heading: 'Pages',
      Value: ({rowData: r}) => getPages(r),
      width: '10%',
      orderBy: 'numPagesGenerated',
    },
  ],
  useRowActions: () =>
    [Cancel],
};
