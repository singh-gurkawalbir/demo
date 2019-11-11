import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import { ActionsFactory as DynaFormWithDynamicActions } from '../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../forms/utils';

export default function GeneralSection(props) {
  const { match, storeId } = props;
  const { integrationId } = match.params;
  const { flows, ...rest } = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    rest,
    integrationId,
    true
  );

  return (
    <DynaFormWithDynamicActions
      fieldMeta={translatedMeta}
      integrationId={integrationId}
      storeId={storeId}
    />
  );
}
