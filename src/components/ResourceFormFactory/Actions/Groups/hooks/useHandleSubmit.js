import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { useLoadIClientOnce } from '../../../../DynaForm/fields/DynaIclient';
import { useSelectorMemo } from '../../../../../hooks';

export default function useHandleSubmit({
  resourceType,
  resourceId,
  isGenerate,
  flowId,
  formKey,
  parentContext,
}) {
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || {};
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const { iClients } = useLoadIClientOnce({
    connectionId: resource._id || resourceId,
    disableLoad:
        !resource._connectorId ||
        !(['shopify'].includes(resource.assistant)),
  });

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  return useCallback(
    closeAfterSave => {
      const newValues = {...values};

      if (resource._connectorId &&
          (['shopify'].includes(resource.assistant) && values['/http/auth/type'] === 'oauth')) {
        newValues['/http/_iClientId'] = iClients?.[0]?._id;
      }
      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }
      dispatch(
        actions.resourceForm.submit(
          resourceType,
          resourceId,
          newValues,
          match,
          !closeAfterSave,
          isGenerate,
          flowId,
          parentContext
        )
      );
    }, [dispatch, flowId, isGenerate, match, resourceId, resourceType, values, parentContext, iClients, resource._connectorId, resource.assistant]);
}
