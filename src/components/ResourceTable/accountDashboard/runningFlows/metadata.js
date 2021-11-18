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
  useColumns: () => {
    const {isIntegrationDashboard, integrationId } = useSelector(state => selectors.filter(state, FILTER_KEYS_AD.DASHBOARD));
    const integrationFilterKey = `${integrationId || ''}${FILTER_KEYS_AD.RUNNING}`;

    return [
      ...(!isIntegrationDashboard ? [{
        key: '_integrationId',
        HeaderValue: function IntegrationSearchFilter() {
          const dispatch = useDispatch();
          const integrationOptions = useSelector(state => selectors.getAllAccountDashboardIntegrations(state));
          const handleSave = useCallback(
            () => {
              dispatch(actions.patchFilter(integrationFilterKey, {
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
      }] : []),
      {
        key: '_flowId',
        HeaderValue: function FlowSearchFilter() {
          const flowOptions = useSelector(state => selectors.getAllAccountDashboardFlows(state, integrationFilterKey));

          return (
            <MultiSelectColumnFilter
              title="Flow"
              filterBy="flowIds"
              filterKey={integrationFilterKey}
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
              filterKey={integrationFilterKey}
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
    ];
  },
  useRowActions: () =>
    [Cancel],
};
