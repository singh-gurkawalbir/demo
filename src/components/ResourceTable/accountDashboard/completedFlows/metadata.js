import React, { useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderWithHelpText from '../../commonCells/HeaderWithHelpText';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../commonCells/Name';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, getTimeString, getDashboardIntegrationId} from '../../../../utils/accountDashboard';
import Status from '../../../Buttons/Status';
import FlowNameWithFlowGroupCell from '../cells/FlowNameWithFlowGroupCell';
import SelectedLabelImp from '../cells/SelectedMultiSelectFilterLabelImp';
import Run from './actions/Run';
import Edit from './actions/Edit';

export default {
  useColumns: () => {
    const match = useRouteMatch();
    let { integrationId } = match.params;
    const { childId } = match.params;

    integrationId = getDashboardIntegrationId(integrationId, childId);
    const integrationFilterKey = `${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`;

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
              filterKey="completedFlows"
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
          const flowOptions = useSelector(state => selectors.getAllAccountDashboardFlows(state, integrationFilterKey, integrationId));

          return (
            <MultiSelectColumnFilter
              title="Flow"
              filterBy="flowIds"
              integrationId={integrationId}
              filterKey={integrationFilterKey}
              SelectedLabelImp={SelectedLabelImp}
              options={flowOptions.map(({ _id, name}) => ({_id, name }))} />
          );
        },
        Value: ({rowData: al}) => (<FlowNameWithFlowGroupCell integrationId={al._integrationId} flowId={al._flowId} />),
      },
      {
        key: 'numOpenError',
        orderBy: 'numOpenError',
        heading: 'Open errors',
        Value: ({rowData: r}) => {
          const match = useRouteMatch();

          return (r.numOpenError && (
          <Status variant="error" size="mini" >
            <Link data-test="account-dashboard-open-errors" to={`${match.url}/${r._flowId}/errorsList`}>{r.numOpenError} </Link>
          </Status>
          )
          );
        },
      },
      {
        key: 'lastErrorAt',
        orderBy: 'lastErrorAt',
        heading: 'Last open error',
        Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastErrorAt} />,
      },
      {
        key: 'lastExecutedAt',
        heading: 'Last run',
        Value: ({rowData: r}) => <CeligoTimeAgo date={new Date(r.lastExecutedAt)} />,
        orderBy: 'lastExecutedAt',
      },
      {
        key: 'numRuns',
        HeaderValue: () => <HeaderWithHelpText title="Runs" helpKey="accountdashboard.numRuns" />,
        orderBy: 'numRuns',
        Value: props => {
          const {rowData: r} = props;

          const match = useRouteMatch();

          return (r.numRuns && (<Link data-test="account-dashboard-run-history" to={`${match.url}/${r._flowId}/runHistory`}>{r.numRuns} </Link>)
          );
        },
      },
      {
        key: 'avgRuntime',
        HeaderValue: () => <HeaderWithHelpText title="Average run time" helpKey="accountdashboard.avgRuntime" />,
        Value: ({rowData: r}) => getTimeString(r.avgRuntime),
        orderBy: 'avgRuntime',
      },
      {
        key: 'success',
        heading: 'Success',
        Value: ({rowData: r}) => r.numSuccess,
        orderBy: 'numSuccess',
      },
      {
        key: 'numIgnore',
        heading: 'Ignored',
        Value: ({rowData: r}) => r.numIgnore,
        orderBy: 'numIgnore',
      },
      {
        key: 'numError',
        heading: 'Errors',
        Value: ({rowData: r}) => r.numError,
        orderBy: 'numError',
      },
      {
        key: 'numResolvedByAuto',
        HeaderValue: () => <HeaderWithHelpText title="Auto-resolved" helpKey="accountdashboard.numResolvedByAuto" />,
        Value: ({rowData: r}) => r.numResolvedByAuto,
        orderBy: 'numResolvedByAuto',
      },
      {
        key: 'numResolvedByUser',
        heading: 'User-resolved',
        Value: ({rowData: r}) => r.numResolvedByUser,
        orderBy: 'numResolvedByUser',
      },
      {
        key: 'numPages',
        heading: 'Pages',
        Value: ({rowData: r}) => r.numPages,
        orderBy: 'numPages',
      },
    ];
  },
  useRowActions: () => [Run, Edit],
};
