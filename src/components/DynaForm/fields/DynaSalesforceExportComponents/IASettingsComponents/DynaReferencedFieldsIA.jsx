import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import DynaReferencedFields from '../DynaReferenedFields';

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
