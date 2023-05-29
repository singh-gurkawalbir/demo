import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import DynaSelectResource from './DynaSelectResource';

export default function DynaSelectAccessTokenResource({ _integrationId, ...rest}) {
  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, _integrationId, true));
  const children = useSelectorMemo(selectors.mkIntegrationTreeChildren, _integrationId);
  let filter = {_integrationId: { $exists: false}};

  if (_integrationId) {
    if (isIntegrationAppV2 && children.length > 1) {
      const childIds = children.map(child => child.value);

      filter = { _integrationId: { $in: childIds } };
    } else {
      filter = { _integrationId };
    }
  }

  return (
    <DynaSelectResource
      {...rest}
      filter={filter}
    />
  );
}

