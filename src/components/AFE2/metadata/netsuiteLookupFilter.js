import React from 'react';
import NetSuiteLookupFilterPanel from '../Editor/panels/NetSuiteLookupFilter';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

export default {
  type: 'netsuiteLookupFilter',
  label: 'Define lookup criteria',
  panels: [
    {
      title: ({editorId}) => <RefreshSearchFilters editorId={editorId} />,
      area: 'rule',
      Panel: NetSuiteLookupFilterPanel,
    },
  ],
};
