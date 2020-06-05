import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import RightDrawer from '../../drawer/Right';

export default function FormStep({ integrationId, formMeta, title, index }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const handleSubmit = useCallback(
    formVal => {
      dispatch(
        actions.integrationApp.installer.scriptInstallStep(
          integrationId,
          '',
          '',
          formVal
        )
      );
      history.goBack();
    },
    [dispatch, history, integrationId]
  );
  const onClose = useCallback(() => {
    history.goBack();
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, '', 'failed')
    );
  }, [dispatch, history, integrationId]);

  return (
    <RightDrawer
      path={`form-${index}`}
      height="tall"
      width="large"
      title={title}
      variant="temporary"
      onClose={onClose}>
      <DynaForm fieldMeta={formMeta} formState={formState}>
        <DynaSubmit
          onClick={handleSubmit}
          showCustomFormValidations={showCustomFormValidations}>
          Submit
        </DynaSubmit>
      </DynaForm>
    </RightDrawer>
  );
}
