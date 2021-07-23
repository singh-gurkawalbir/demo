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
import {FILTER_KEYS_AD, getTimeString} from '../../../../utils/accountDashboard';
import Status from '../../../Buttons/Status';

export default {
  useColumns: () => [
    {
      key: '_integrationId',
      HeaderValue: function IntegrationSearchFilter() {
        const dispatch = useDispatch();
        const integrationOptions = useSelector(state => selectors.getAllAccountDashboardIntegrations(state));
        const handleSave = useCallback(
          () => {
            dispatch(actions.patchFilter(FILTER_KEYS_AD.COMPLETED, {
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
    },
    {
      key: '_flowId',
      HeaderValue: function FlowSearchFilter() {
        const flowOptions = useSelector(state => selectors.getAllAccountDashboardFlows(state, FILTER_KEYS_AD.COMPLETED));

        return (
          <MultiSelectColumnFilter
            title="Flow"
            filterBy="flowIds"
            filterKey="completedFlows"
            options={flowOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'flow', _resourceId: al._flowId}} actionProps={tableContext} />;
      },
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
      heading: 'Last run completed',
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
      orderBy: 'success',
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
      heading: 'Auto-resolved',
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
  ],
};
