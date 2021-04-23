import React from 'react';
import SalesforceLookupFilterPanel from '../Editor/panels/SalesforceLookupFilter';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

export default {
  type: 'salesforceLookupFilter',
  label: 'Define lookup criteria',
  panels: [
    {
      title: ({editorId}) => <RefreshSearchFilters editorId={editorId} />,
      area: 'rule',
      Panel: SalesforceLookupFilterPanel,
    },
  ],
};
