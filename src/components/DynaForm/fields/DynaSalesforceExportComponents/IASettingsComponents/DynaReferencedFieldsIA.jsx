import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import DynaReferencedFields from '../DynaReferenedFields';

export default function DynaReferencedFieldsIA(fieldMetaProps) {
  const exportResource = useSelector(state =>
    selectors.getFlowsAssociatedExportFromIAMetadata(state, fieldMetaProps)
  );
  const { sObjectType } = exportResource || {};

  return <DynaReferencedFields {...fieldMetaProps} options={sObjectType} />;
}
