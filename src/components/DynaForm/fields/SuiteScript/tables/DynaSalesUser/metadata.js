import React from 'react';

import CheckmarkIcon from '../../../../../icons/CheckmarkIcon';
import CancelIcon from '../../../../../icons/CancelIcon';

export default {
  useColumns: () => [
    {
      key: 'email',
      heading: 'Email',
      Value: ({rowData: r}) => r?.email,
    },
    {
      key: 'inSalesforce',
      heading: 'In Salesforce',
      Value: ({rowData: r}) => r?.inSalesforce ? <><CheckmarkIcon color="primary" />{r?.sfName} </> : <CancelIcon color="error" />,
    },
    {
      key: 'profile',
      heading: 'Profile',
      Value: ({rowData: r}) => r?.profile,
    },
    {
      key: 'inNetsuite',
      heading: 'In Netsuite',
      Value: ({rowData: r}) => r?.inNetSuite ? <><CheckmarkIcon color="primary" />{r?.sfName} </> : <CancelIcon color="error" />,
    },
    {
      key: 'salesRole',
      heading: 'Sales Role',
      Value: ({rowData: r}) => r?.salesRole,
    },
  ],
};
