import React from 'react';
import SalesforceQualificationCriteriaPanel from '../Editor/panels/SalesforceQualificationCriteria';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

export default {
  type: 'salesforceQualificationCriteria',
  label: 'Field specific qualification criteria',
  panels: [
    {
      title: ({editorId}) => <RefreshSearchFilters editorId={editorId} />,
      area: 'rule',
      Panel: SalesforceQualificationCriteriaPanel,
    },
  ],
};
