import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import { ActionsFactory as DynaFromWithDynamicActions } from '../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../forms/utils';

export default function GeneralSection(props) {
  const { match } = props;
  const { integrationId, storeId } = match.params;
  const { flows, ...rest } = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    rest,
    integrationId,
    true
  );

  return <DynaFromWithDynamicActions fieldMeta={translatedMeta} />;
}
