import DynaRelatedList from '../DynaRelatedList';
import { useGetSalesforceExportDetails } from './DynaReferencedFieldsIA';

export default function DynaRelatedListIA(fieldMetaProps) {
  const { sObjectType, connectionId } = useGetSalesforceExportDetails(
    fieldMetaProps
  );

  return (
    <DynaRelatedList
      {...fieldMetaProps}
      options={sObjectType}
      connectionId={connectionId}
    />
  );
}
