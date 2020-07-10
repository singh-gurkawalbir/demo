import React from 'react';
import DynaSuiteScriptTableWrapped from './DynaSalesforceProductTable';
import DynaMapTable from './DynaMapTable';
import DynaMapSubsidaries from './DynaMapSubsidaries';

const SalesforceProductOptions = (props) => {
  const {salesforceProductField, salesforceProductFieldOptions, salesforceSubsidiaryField, salesforceSubsidiaryFieldOptions} = props;

  if (salesforceProductField || salesforceProductFieldOptions) { return <DynaSuiteScriptTableWrapped {...props} />; }

  if (salesforceSubsidiaryField || salesforceSubsidiaryFieldOptions) {
    return <DynaMapSubsidaries {...props} />;
  }
  return <DynaMapTable {...props} />;
};
export default SalesforceProductOptions;
