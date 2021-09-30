import React from 'react';
import NetSuiteQualificationCriteriaPanel from '../Editor/panels/NetSuiteQualificationCriteria';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

export default {
  type: 'netsuiteQualificationCriteria',
  label: 'Field specific qualification criteria',
  panels: [
    {
      title: ({editorId}) => <RefreshSearchFilters editorId={editorId} />,
      area: 'rule',
      Panel: NetSuiteQualificationCriteriaPanel,
    },
  ],
};
