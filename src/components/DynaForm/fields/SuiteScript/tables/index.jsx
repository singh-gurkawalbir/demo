import React from 'react';
import DynaSuiteScriptTableWrapped from './DynaSalesforceProductTable';
import DynaMapTable from './DynaMapTable';
import DynaMapSubsidaries from './DynaMapSubsidaries';
import DynaSalesUser from './DynaSalesUser';

const SalesforceProductOptions = props => {
  const {salesforceProductField, salesforceProductFieldOptions, salesforceSubsidiaryField, salesforceSubsidiaryFieldOptions, id} = props;

  if (salesforceProductField || salesforceProductFieldOptions) { return <DynaSuiteScriptTableWrapped {...props} />; }

  if (salesforceSubsidiaryField || salesforceSubsidiaryFieldOptions) {
    return <DynaMapSubsidaries {...props} />;
  }
  if (id === 'SalesUsers') {
    return <DynaSalesUser {...props} />;
  }

  return <DynaMapTable {...props} />;
};

export default SalesforceProductOptions;
