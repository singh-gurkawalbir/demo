import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import DynaRelatedList from '../DynaRelatedList';

export default function DynaRelatedListIA(fieldMetaProps) {
  const exportResource = useSelector(state =>
    selectors.getFlowsAssociatedExportFromIAMetadata(state, fieldMetaProps)
  );
  const { sObjectType } = exportResource || {};

  return <DynaRelatedList {...fieldMetaProps} options={sObjectType} />;
}
