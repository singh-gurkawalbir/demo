import React from 'react';

import CheckmarkIcon from '../../../../../icons/CheckmarkIcon';
import CancelIcon from '../../../../../icons/CancelIcon';


export default {
  columns: [
    {
      heading: 'Email',
      value: r => r?.email,
    },
    {
      heading: 'In Salesforce',

      value: r => r?.inSalesforce ? <><CheckmarkIcon />{r?.sfName} </> : <CancelIcon />,
    },
    {
      heading: 'Profile',

      value: r => r?.profile,
    },
    {
      heading: 'In Netsuite',

      value: r => r?.inNetSuite ? <><CheckmarkIcon />{r?.sfName} </> : <CancelIcon />,
    },
    {
      heading: 'Sales Role',

      value: r => r?.salesRole,
    },
  ],
};
