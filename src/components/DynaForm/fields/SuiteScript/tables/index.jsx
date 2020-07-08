import React from 'react';
import DynaSuiteScriptTableWrapped from './DynaSalesforceProductTable';
import DynaMapTable from './DynaMapTable';


const SalesforceProductOptions = (props) => {
  const {salesforceProductField, salesforceProductFieldOptions} = props;

  if (salesforceProductField || salesforceProductFieldOptions) { return <DynaSuiteScriptTableWrapped {...props} />; }

  return <DynaMapTable {...props} />;
};
export default SalesforceProductOptions;
