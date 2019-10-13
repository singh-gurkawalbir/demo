import { Typography } from '@material-ui/core';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import { ActionsFactory as DynaFromWithDynamicActions } from '../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../forms/utils';

export default function GeneralSection(props) {
  const { match } = props;
  const { integrationId, storeId } = match.params;
  const { flows, ...rest } = useSelector(state =>
    selectors.getGeneralSettingsForIntegrationApp(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    rest,
    integrationId
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count => count + 1);
  }, []);

  return (
    <Fragment>
      <Typography>General Section Renders here</Typography>;
      <DynaFromWithDynamicActions key={count} fieldMeta={translatedMeta} />
    </Fragment>
  );
}
