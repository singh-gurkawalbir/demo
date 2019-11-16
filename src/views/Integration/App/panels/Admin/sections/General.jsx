import { Fragment } from 'react';
// import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import PanelHeader from '../../../../common/PanelHeader';
import { ActionsFactory as DynaFormWithDynamicActions } from '../../../../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';

export default function GeneralSection({ integrationId, storeId }) {
  const { flows, ...rest } = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    rest,
    integrationId,
    true
  );

  return (
    <Fragment>
      <PanelHeader title="General settings" />

      <DynaFormWithDynamicActions
        fieldMeta={translatedMeta}
        integrationId={integrationId}
        storeId={storeId}
      />
    </Fragment>
  );
}
