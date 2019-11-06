import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const dispatch = useDispatch();
  const [requested, setRequested] = useState(false);
  const integrationApp = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  useEffect(() => {
    if (!integrationApp && !requested) {
      dispatch(actions.resource.requestCollection('integrations'));
      setRequested(true);
    }
  }, [dispatch, integrationApp, requested]);

  return integrationApp ? integrationApp.name : 'Integration App';
};

export const StoreCrumb = ({ integrationId, storeId }) => {
  const dispatch = useDispatch();
  const [requested, setRequested] = useState(false);
  const integrationResource = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId, storeId)
  );

  useEffect(() => {
    if ((!integrationResource || isEmpty(integrationResource)) && !requested) {
      dispatch(actions.resource.requestCollection('integrations'));
      setRequested(true);
    }
  }, [dispatch, integrationResource, requested]);

  if (
    isEmpty(integrationResource) ||
    (integrationResource.settings &&
      !integrationResource.settings.supportsMultiStore)
  ) {
    return storeId;
  }

  const store = integrationResource.stores.find(s => s.value === storeId);

  return store ? store.label : storeId;
};
