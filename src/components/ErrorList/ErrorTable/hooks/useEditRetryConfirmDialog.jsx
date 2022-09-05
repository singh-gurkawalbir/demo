import { isEqual } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';

export const useEditRetryConfirmDialog = ({
  flowId,
  resourceId,
  retryId,
}) => {
  const dispatch = useDispatch();
  const { saveDiscardDialog } = useConfirmDialog();
  const retryData = useSelector(state => selectors.retryData(state, retryId));
  const userRetryData = useSelector(state => selectors.userRetryData(state, retryId));

  const clearUserRetryData = useCallback(() => {
    dispatch(actions.errorManager.retryData.updateUserRetryData({retryId, retryData: undefined}));
  }, [dispatch, retryId]);

  const onSave = useCallback(() => {
    dispatch(
      actions.errorManager.retryData.updateRequest({
        flowId,
        resourceId,
        retryId,
        retryData: userRetryData,
      })
    );
  }, [dispatch, flowId, resourceId, retryId, userRetryData]);

  const isRetryDataChanged = userRetryData && !isEqual(retryData, userRetryData);
  const showRetryDataChangedConfirmDialog = useCallback(onDiscard => {
    const onClose = () => {
      typeof onDiscard === 'function' && onDiscard();
      clearUserRetryData();
    };

    if (isRetryDataChanged) {
      saveDiscardDialog({
        onSave,
        onDiscard: onClose,
      });
    } else {
      onDiscard();
      clearUserRetryData();
    }
  }, [isRetryDataChanged, saveDiscardDialog, onSave, clearUserRetryData]);

  return showRetryDataChangedConfirmDialog;
};
