import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import {selectors} from '../../../../reducers';
import SelectError from '../../../ErrorList/ErrorDetails/ErrorDetailActions/SelectError';
import SelectSource from '../cells/SelectSource';
import SelectClassification from '../cells/SelectClassification';
import SelectDate from '../cells/SelectDate';
import Classification from '../cells/Classification';
import SelectAllErrors from '../cells/SelectAllErrors';
import CodeCell from '../cells/CodeCell';
import TextOverflowCell from '../../../TextOverflowCell';
import ErrorMessage from '../cells/ErrorMessage';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

export default {
  rowKey: 'errorId',
  additionalConfigs: {
    IsActiveRow: ({ rowData }) => {
      const errorFilter = useSelector(
        state => selectors.filter(state, FILTER_KEYS.OPEN), shallowEqual
      );

      return errorFilter?.activeErrorId === rowData.errorId;
    },
  },
  useColumns: () => [
    {
      key: 'selectAll',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectAllErrors {...tableContext} />;
      },
      heading: 'Select All',
      isLoggable: true,
      Value: ({ rowData: error }) => {
        const tableContext = useGetTableContext();

        return <SelectError error={error} {...tableContext} />;
      },
      width: '32px',
    },
    {
      key: 'message',
      heading: 'Message',
      Value: ({rowData: r}) => {
        const {flowId, resourceId} = useGetTableContext();

        return (
          <ErrorMessage
            message={r.message}
            errorId={r.errorId}
            flowId={flowId}
            resourceId={resourceId}
            exportDataURI={r.exportDataURI}
            importDataURI={r.importDataURI}
        />
        );
      },
    },
    {
      key: 'code',
      heading: 'Code',
      isLoggable: true,
      Value: ({rowData: r}) => <CodeCell message={r.code} />,
    },
    {
      key: 'selectSource',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
    },
    {
      key: 'selectClassification',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectClassification {...tableContext} />;
      },
      isLoggable: true,
      Value: ({rowData: r}) => <Classification error={r} />,
    },
    {
      key: 'selectDate',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectDate {...tableContext} />;
      },
      Value: ({rowData: r}) => <TimeAgo date={r.occurredAt} />,
    },
  ],
};
