import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useHandleClickWhenValid from './useHandleClickWhenValid';

export default function useHandleSubmit({
  resourceType,
  resourceId,
  isGenerate,
  flowId,
  formKey,
}) {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleSubmit = useCallback(
    closeAfterSave => {
      const newValues = { ...values };

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
          flowId
        )
      );
    }, [dispatch, flowId, isGenerate, match, resourceId, resourceType, values]);

  return useHandleClickWhenValid(formKey, handleSubmit);
}
