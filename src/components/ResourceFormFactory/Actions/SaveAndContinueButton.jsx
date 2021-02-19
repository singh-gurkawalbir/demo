import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import { selectors } from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';

const SaveAndContinueButton = props => {
  const {
    label,
    resourceType,
    resourceId,
    disabled = false,
  } = props;

  const match = useRouteMatch();

  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.resourceForm.saveAndContinue(
          resourceType,
          resourceId,
          values,
          match
        )
      );
    },
    [dispatch, match, resourceId, resourceType]
  );
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
  });

  return (
    <DynaAction
      {...props}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {disableSave ? 'Saving' : label}
    </DynaAction>
  );
};

export default SaveAndContinueButton;
