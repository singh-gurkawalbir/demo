import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const history = useHistory();
  const integrationAppName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name || 'Integration App'
  );
  const defaultChildId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId)
  );
  const integrationAppUrlName = getIntegrationAppUrlName(integrationAppName);

  const handleClick = useCallback(e => {
    if (defaultChildId) {
      e.preventDefault();
      history.push(`/integrationapps/${integrationAppUrlName}/${integrationId}/child/${defaultChildId}`);
    }
  }, [defaultChildId, history, integrationAppUrlName, integrationId]);

  return (
    <LoadResources resources="integrations">
      <span onClick={handleClick}>
        {integrationAppName}
      </span>
    </LoadResources>
  );
};

export const StoreCrumb = ({ integrationId, storeId }) => {
  const iaSettings = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const store = iaSettings?.stores?.find(s => s?.value === storeId);

  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const childName = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', storeId);

    return integration && integration.name;
  });

  if (isFrameWork2) {
    return childName || storeId;
  }

  return (
    <LoadResources resources="integrations">
      {store ? store.label : storeId}
    </LoadResources>
  );
};
