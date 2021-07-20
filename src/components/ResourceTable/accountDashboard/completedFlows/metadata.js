import React, { useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../commonCells/Name';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {FILTER_KEYS_AD} from '../../../../utils/accountDashboard';
import Status from '../../../Buttons/Status';

export default {
  useColumns: () => [
    {
      key: 'integrationName',
      HeaderValue: function IntegrationSearchFilter() {
        const dispatch = useDispatch();
        const integrationOptions = useSelector(state => selectors.getAllIntegrations(state));
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
      key: 'flowName',
      HeaderValue: function FlowSearchFilter() {
        const flowOptions = useSelector(state => selectors.getAllFlows(state, FILTER_KEYS_AD.COMPLETED));

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
      width: '10%',
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
      width: '10%',
    },
    {
      key: 'lastErrorAt',
      orderBy: 'lastErrorAt',
      heading: 'Last open error',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastErrorAt} />,
      width: '10%',
    },
    {
      key: 'lastExecutedAt',
      heading: 'Last run completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={new Date(r.lastExecutedAt)} />,
      width: '10%',
      orderBy: 'lastExecutedAt',
    },
    {
      key: 'numRuns',
      heading: 'Runs',
      orderBy: 'numRuns',
      Value: props => {
        const {rowData: r} = props;

        const match = useRouteMatch();

        return (r.numRuns && (<Link data-test="account-dashboard-run-history" to={`${match.url}/${r._flowId}/runHistory`}>{r.numRuns} </Link>)
        );
      },
      width: '10%',
    },
    {
      key: 'avgRuntime',
      heading: 'Average run time',
      Value: ({rowData: r}) => new Date(r.avgRuntime * 1000).toISOString().substr(11, 8),
      width: '10%',
      orderBy: 'avgRuntime',
    },
    {
      key: 'success',
      heading: 'Success',
      Value: ({rowData: r}) => r.numSuccess,
      width: '10%',
      orderBy: 'success',
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
      key: 'numResolvedByAuto',
      heading: 'Auto-resolved',
      Value: ({rowData: r}) => r.numResolvedByAuto,
      width: '10%',
      orderBy: 'numResolvedByAuto',
    },
    {
      key: 'numResolvedByUser',
      heading: 'User-resolved',
      Value: ({rowData: r}) => r.numResolvedByUser,
      width: '10%',
      orderBy: 'numResolvedByUser',
    },
    {
      key: 'numPages',
      heading: 'Pages',
      Value: ({rowData: r}) => r.numPages,
      width: '10%',
      orderBy: 'numPages',
    },
  ],
};
