import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { REVISION_TYPES } from '../../../../constants';
import { selectors } from '../../../../reducers';
import useConfirmDialog from '../../../ConfirmDialog';

const INFO = {
  PULL: {
    TITLE: 'You\'ve got a merge in progress',
    MESSAGE: 'Are you sure you want to close this installer? Your current merge in progress for your pull will be canceled ',
    CANCEL_BUTTON: 'Cancel merge',
    CONTINUE_BUTTON: 'Continue merge',
  },
  REVERT: {
    TITLE: 'You\'ve got a revert in progress',
    MESSAGE: 'Are you sure you want to close this installer? The merges you made for this revert will be canceled ',
    CANCEL_BUTTON: 'Cancel merge',
    CONTINUE_BUTTON: 'Continue merge',
  },
};

export default function useCancelRevision({ integrationId, revisionId, onClose }) {
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const revisionType = useSelector(state => selectors.revisionType(state, integrationId, revisionId));
  const DIALOG_PROPS = (revisionType === REVISION_TYPES.PULL) ? INFO.PULL : INFO.REVERT;
  const handleCancel = useCallback(
    () => {
      confirmDialog({
        title: DIALOG_PROPS.TITLE,
        message: DIALOG_PROPS.MESSAGE,
        buttons: [
          {
            label: DIALOG_PROPS.CANCEL_BUTTON,
            onClick: () => {
              if (typeof onClose === 'function') {
                onClose();
              }
              dispatch(actions.integrationLCM.revision.cancel(integrationId, revisionId));
            },
          },
          {
            label: DIALOG_PROPS.CONTINUE_BUTTON,
            variant: 'outlined',
          },
        ],
      });
    },
    [onClose, dispatch, confirmDialog, integrationId, revisionId, DIALOG_PROPS],
  );

  if (![REVISION_TYPES.PULL, REVISION_TYPES.REVERT].includes(revisionType)) {
    // If the revision type does not support cancelling, return an empty function
    return () => {};
  }

  return handleCancel;
}
