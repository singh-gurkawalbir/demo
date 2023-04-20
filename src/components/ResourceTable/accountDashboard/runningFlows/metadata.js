import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { TimeAgo } from '@celigo/fuse-ui';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../commonCells/Name';
import HeaderWithHelpText from '../../commonCells/HeaderWithHelpText';
import JobStatus from '../../../JobDashboard/JobStatus';
import { getPages, getSuccess } from '../../../../utils/jobdashboard';
import Cancel from './actions/Cancel';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, RUNNNING_STATUS_OPTIONS, getDashboardIntegrationId} from '../../../../utils/accountDashboard';
import FlowNameWithFlowGroupCell from '../cells/FlowNameWithFlowGroupCell';
import SelectedLabelImp from '../cells/SelectedMultiSelectFilterLabelImp';

export default {
  useColumns: () => {
    const match = useRouteMatch();
    let { integrationId } = match.params;
    const { childId } = match.params;
    const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

    integrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);
    const integrationFilterKey = `${integrationId || ''}${FILTER_KEYS_AD.RUNNING}`;

    return [
      ...(!integrationId ? [{
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
        isLoggable: true,
        Value: ({rowData: al}) => {
          const tableContext = useGetTableContext();

          return <NameCell al={{resourceType: 'integration', _resourceId: al._integrationId || 'none'}} actionProps={tableContext} />;
        },
      }] : []),
      {
        key: '_flowId',
        HeaderValue: function FlowSearchFilter() {
          const flowOptions = useSelector(state => selectors.getAllAccountDashboardFlows(state, integrationFilterKey, integrationId));

          return (
            <MultiSelectColumnFilter
              title="Flow"
              filterBy="flowIds"
              filterKey={integrationFilterKey}
              SelectedLabelImp={SelectedLabelImp}
              options={flowOptions.map(({ _id, name}) => ({_id, name }))} />
          );
        },
        isLoggable: true,
        Value: ({rowData: al}) => (<FlowNameWithFlowGroupCell integrationId={al._integrationId} flowId={al._flowId} />),
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
        isLoggable: true,
        Value: ({rowData: al}) => <JobStatus job={al} />,
        width: '10%',
      },
      {
        key: 'startedAt',
        heading: 'Started',
        isLoggable: true,
        Value: ({rowData: r}) => <TimeAgo date={r.startedAt} />,
        orderBy: 'startedAt',
        width: '10%',
      },
      {
        key: 'numSuccess',
        heading: 'Success',
        isLoggable: true,
        Value: ({rowData: r}) => getSuccess(r),
        width: '10%',
        orderBy: 'numSuccess',
      },
      {
        key: 'numIgnore',
        heading: 'Ignored',
        isLoggable: true,
        Value: ({rowData: r}) => r.numIgnore,
        width: '10%',
        orderBy: 'numIgnore',
      },
      {
        key: 'numError',
        heading: 'Errors',
        isLoggable: true,
        Value: ({rowData: r}) => r.numError,
        width: '10%',
        orderBy: 'numError',
      },
      {
        key: 'numResolved',
        HeaderValue: () => <HeaderWithHelpText title="Auto-resolved" helpKey="accountdashboard.numResolvedByAuto" />,
        isLoggable: true,
        Value: ({rowData: r}) => r.numResolved,
        width: '10%',
        orderBy: 'numResolved',
      },
      {
        key: 'numPagesGenerated',
        heading: 'Pages',
        isLoggable: true,
        Value: ({rowData: r}) => getPages(r),
        width: '10%',
        orderBy: 'numPagesGenerated',
      },
    ];
  },
  useRowActions: () =>
    [Cancel],
};
