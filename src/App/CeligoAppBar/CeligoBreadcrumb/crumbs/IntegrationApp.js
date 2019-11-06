import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

export default function IntegrationAppCrumb({ integrationId }) {
  const dispatch = useDispatch();
  const integrationApp = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  useEffect(() => {
    if (!integrationApp) {
      dispatch(actions.resource.requestCollection('integrations'));
    }
  }, [dispatch, integrationApp]);

  return integrationApp ? integrationApp.name : 'Integration App';
}
