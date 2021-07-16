import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Button} from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../auditLog/cells/Name';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import MultiSelectParentChildColumnFilter from '../../commonCells/MultiSelectParentChildColumnFilter';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({

  error: {
    width: '10.15%',
    textAlign: 'right',
  },
  errorCount: {
    color: theme.palette.error.dark,
  },

}));

export default {
  useColumns: () => [
    {
      key: 'integrationName',
      HeaderValue: function IntegrationSearchFilter() {
        const dispatch = useDispatch();
        const integrationOptions = useSelector(state => selectors.getAllIntegrations(state));
        const handleSave = useCallback(
          () => {
            dispatch(actions.patchFilter('completedFlows', {
              flowIds: ['all'],
            }));
          },
          [dispatch],
        );

        return (
          <MultiSelectParentChildColumnFilter
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
        const flowOptions = useSelector(state => selectors.getAllFlows(state));

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
      heading: 'Open errors',
      Value: ({rowData: r}) => {
        const history = useHistory();
        const match = useRouteMatch();
        const handleOpenErrorsClick = useCallback(() => {
          history.push(`${match.url}/${r._flowId}/errorsList`);
        }, [history, match.url, r._flowId]);

        return (r.numOpenError && (
          <Button
            onClick={handleOpenErrorsClick}
            >{r.numOpenError}
          </Button>
        ));
      },
      width: '10%',
    },
    {
      key: 'lastErrorAt',
      heading: 'Last open error',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastErrorAt} />,
      width: '10%',
    },
    {
      key: 'lastExecutedAt',
      heading: 'Last run completed',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastExecutedAt} />,
      width: '10%',
    },
    {
      key: 'numRuns',
      heading: 'Runs',
      Value: props => {
        const {rowData: r} = props;
        const classes = useStyles();

        const history = useHistory();
        const match = useRouteMatch();
        const handleRunHistoryClick = useCallback(() => {
          history.push(`${match.url}/${r._flowId}/runHistory`);
        }, [history, match.url, r._flowId]);

        return (
          <Button
            onClick={handleRunHistoryClick}
            className={clsx(classes.error, {
              [classes.errorCount]: r.numError > 0,
            })}>{r.numRuns}
          </Button>

        );
      },
      width: '10%',
    },
    {
      key: 'avgRuntime',
      heading: 'Average run time',
      Value: ({rowData: r}) => new Date(r.avgRuntime * 1000).toISOString().substr(11, 8),
      width: '10%',
    },
    {
      key: 'success',
      heading: 'Success',
      Value: ({rowData: r}) => r.numSuccess || 0,
      width: '10%',
    },
    {
      key: 'numIgnore',
      heading: 'Ignored',
      Value: ({rowData: r}) => r.numIgnore || 0,
      width: '10%',
    },
    {
      key: 'numError',
      heading: 'Errors',
      Value: ({rowData: r}) => r.numError || 0,
      width: '10%',
    },
    {
      key: 'numResolvedByAuto',
      heading: 'Auto-resolved',
      Value: ({rowData: r}) => r.numResolvedByAuto || 0,
      width: '10%',
    },
    {
      key: 'numResolvedByUser',
      heading: 'User-resolved',
      Value: ({rowData: r}) => r.numResolvedByUser || 0,
      width: '10%',
    },
    {
      key: 'numPages',
      heading: 'Pages',
      Value: ({rowData: r}) => r.numPages || 0,
      width: '10%',
    },
  ],
};
