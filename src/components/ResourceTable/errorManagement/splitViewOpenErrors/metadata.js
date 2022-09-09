import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {selectors} from '../../../../reducers';
import SelectError from '../../../ErrorList/ErrorDetails/ErrorDetailActions/SelectError';
import SelectSource from '../cells/SelectSource';
import SelectClassification from '../cells/SelectClassification';
import SelectDate from '../cells/SelectDate';
import Classification from '../cells/Classification';
import SelectAllErrors from '../cells/SelectAllErrors';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
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
    IsThisCurrentNavItem: ({ rowData }) => {
      const errorFilter = useSelector(
        state => selectors.filter(state, FILTER_KEYS.OPEN), shallowEqual
      );

      return errorFilter?.currentNavItem === rowData.errorId;
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
    },
    {
      key: 'message',
      heading: 'Message',
      width: '40%',
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
      Value: ({rowData: r}) => <TextOverflowCell message={r.code} />,
      width: '15%',
    },
    {
      key: 'selectSource',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
      width: '15%',
    },
    {
      key: 'selectClassification',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectClassification {...tableContext} />;
      },
      isLoggable: true,
      Value: ({rowData: r}) => <Classification error={r} />,
      width: '10%',
    },
    {
      key: 'selectDate',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectDate {...tableContext} />;
      },
      width: '15%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.occurredAt} />,
    },
  ],
};
