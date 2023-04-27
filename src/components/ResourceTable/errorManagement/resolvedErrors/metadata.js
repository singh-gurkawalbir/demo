import React from 'react';
import { useSelector } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import Retry from '../actions/Retry';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import ViewHttpRequest from '../actions/ViewHttpRequest';
import ViewHttpResponse from '../actions/ViewHttpResponse';
import SelectError from '../../../ErrorList/ErrorDetails/ErrorDetailActions/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import TextOverflowCell from '../../../TextOverflowCell';
import SelectSource from '../cells/SelectSource';
import SelectClassification from '../cells/SelectClassification';
import Classification from '../cells/Classification';
import SelectDate from '../cells/SelectDate';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import EditRetryData from '../actions/EditRetry';
import { selectors } from '../../../../reducers';
import ViewNetsuiteRequest from '../actions/ViewNetsuiteRequest';
import ViewNetsuiteResponse from '../actions/ViewNetsuiteResponse';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { message } from '../../../../utils/messageStore';
import PurgeError from '../actions/PurgeError';

const options = {allowedTags: ['a']};
export default {
  rowKey: 'errorId',
  additionalConfigs: {
    actionMenuTooltip: message.ERROR_MANAGEMENT_2.VIEW_ACTIONS_HOVER_MESSAGE,
    IsActiveRow: ({ rowData }) => {
      const activeErrorId = useSelector(
        state => selectors.filter(state, FILTER_KEYS.RESOLVED)?.activeErrorId
      );

      return activeErrorId === rowData.errorId;
    },
  },
  useColumns: () => [
    {
      key: 'selectAll',
      width: 24,
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectAllErrors {...tableContext} />;
      },
      heading: 'Select All',
      Value: ({rowData: error}) => {
        const tableContext = useGetTableContext();

        return <SelectError error={error} {...tableContext} />;
      },
    },
    {
      key: 'message',
      heading: 'Message',
      width: '25%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.message} rawHtmlOptions={options} containsHtml />,
    },
    {
      key: 'code',
      heading: 'Code',
      isLoggable: true,
      width: '18%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.code} />,
    },
    {
      key: 'selectResource',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      width: '10%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
    },
    {
      key: 'selectResolvedClassification',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectClassification {...tableContext} />;
      },
      isLoggable: true,
      Value: ({rowData: r}) => <Classification error={r} isResolved />,
      width: '10%',
    },
    {
      key: 'selectDate',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectDate {...tableContext} />;
      },
      width: '12%',
      Value: ({rowData: r}) => <TimeAgo date={r.occurredAt} />,
    },
    {
      key: 'resolvedBy',
      heading: 'Resolved by',
      width: '12%',
      Value: ({rowData: r}) => {
        const {flowId} = useGetTableContext();

        return <UserName userId={r.resolvedBy} flowId={flowId} jobType={r.type} />;
      },
    },
    {
      key: 'resolvedAt',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return (
          <SelectDate
            {...tableContext}
            title="Resolved at"
            filterBy="resolvedAt" />
        );
      },
      width: '12%',
      Value: ({rowData: r}) => <TimeAgo date={r.resolvedAt} />,
    },
  ],
  useRowActions: ({ retryDataKey, reqAndResKey }) => {
    const {actionInProgress, resourceId} = useGetTableContext();
    const isResourceNetsuite = useSelector(state => selectors.isResourceNetsuite(state, resourceId));
    const actions = [];

    if (actionInProgress) return actions;
    if (retryDataKey) {
      actions.push(EditRetryData);
      actions.push(Retry);
    }
    actions.push(ViewErrorDetails);
    if (reqAndResKey) {
      isResourceNetsuite
        ? actions.push(ViewNetsuiteRequest, ViewNetsuiteResponse)
        : actions.push(ViewHttpRequest, ViewHttpResponse);
    }
    actions.push(PurgeError);

    return actions;
  },
};
