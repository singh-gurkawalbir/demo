import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import DynaReferencedFields from '../DynaReferencedFields';

export const useGetSalesforceExportDetails = props => {
  const exportResource = useSelector(state =>
    selectors.getFlowsAssociatedExportFromIAMetadata(state, props)
  );
  const { _connectionId: connectionId } = exportResource || {};
  const { sObjectType } = (exportResource && exportResource.salesforce) || {};

  return { sObjectType, connectionId };
};

export default function DynaReferencedFieldsIA(fieldMetaProps) {
  const { sObjectType, connectionId } = useGetSalesforceExportDetails(
    fieldMetaProps
  );

  return (
    <DynaReferencedFields
      {...fieldMetaProps}
      options={sObjectType}
      connectionId={connectionId}
    />
  );
}
