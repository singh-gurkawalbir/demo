import { isEqual } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

export const useEditRetryConfirmDialog = ({
  flowId,
  resourceId,
  isResolved,
}) => {
  const dispatch = useDispatch();
  const { saveDiscardDialog } = useConfirmDialog();
  const errorId = useSelector(state => selectors.filter(state, FILTER_KEYS.OPEN)?.activeErrorId);

  const retryId = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId, isResolved })?.retryDataKey
  );

  const retryData = useSelector(state => selectors.retryData(state, retryId));
  const userRetryData = useSelector(state => selectors.userRetryData(state, retryId));

  const clearUserRetryData = useCallback(() => {
    dispatch(actions.errorManager.retryData.updateUserRetryData({retryId}));
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

  const showRetryDataChangedConfirmDialog = useCallback((onDiscard, isSave) => {
    const onClose = () => {
      typeof onDiscard === 'function' && onDiscard();
      clearUserRetryData();
    };

    if (isRetryDataChanged && isSave !== true) {
      saveDiscardDialog({
        onSave,
        onDiscard: onClose,
      });
    } else {
      onClose();
    }
  }, [isRetryDataChanged, saveDiscardDialog, onSave, clearUserRetryData]);

  return showRetryDataChangedConfirmDialog;
};
