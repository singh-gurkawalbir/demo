import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import CeligoTable from '../../../components/ResourceTable';
import metadata from './metadata';
import { ActionsFactory as DynaFromWithDynamicActions } from '../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../forms/utils';

export default function Flows(props) {
  const { match } = props;
  const { integrationId, section, storeId } = match.params;
  const { flows, ...rest } = useSelector(state =>
    selectors.getRequiredDataOfConnectorSettings(
      state,
      integrationId,
      section,
      storeId
    )
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(rest);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count => count + 1);
  }, [section]);

  return (
    <Fragment>
      <LoadResources required resources="flows, connections, exports, imports">
        <CeligoTable
          resourceType="flows"
          data={flows}
          {...metadata}
          actionProps={{ rest }}
        />
      </LoadResources>
      <DynaFromWithDynamicActions key={count} fieldMeta={translatedMeta} />
    </Fragment>
  );
}
