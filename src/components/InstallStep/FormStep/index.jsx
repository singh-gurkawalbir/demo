import React, { useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import { selectors} from '../../../reducers';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';

const emptyObject = {};

function FormStepContent({ integrationId, formSubmitHandler, formCloseHandler }) {
  const { formType } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { installerFunction, name, formMeta, form } = useSelector(
    state => selectors.currentStepPerMode(state, { mode: formType, integrationId }) || emptyObject
  );

  const formMetaData = useMemo(() => {
    if (formType === 'install') {
      return formMeta;
    }

    return form;
  }, [formType, formMeta, form]);

  const goBackToParentUrl = useCallback(() => history.goBack(), [history]);

  const handleSubmit = useCallback(
    formVal => {
      if (installerFunction) {
        // For IA1.0
        if (formType === 'child') {
          // Add new child case
          dispatch(actions.integrationApp.child.updateStep(
            integrationId,
            installerFunction,
            'inProgress',
            false
          ));
          dispatch(
            actions.integrationApp.child.installStep(
              integrationId,
              installerFunction,
              formVal
            )
          );
        } else {
          dispatch(
            actions.integrationApp.installer.installStep(
              integrationId,
              installerFunction,
              undefined,
              undefined,
              formVal
            )
          );
        }
      } else {
        // For IA2.0
        dispatch(
          actions.integrationApp.installer.scriptInstallStep(
            integrationId,
            '',
            '',
            formVal
          )
        );
      }
    },
    [dispatch, installerFunction, integrationId, formType]
  );
  const handleClose = useCallback(() => {
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, '', 'failed')
    );
  }, [dispatch, integrationId]);

  const onSubmit = useCallback((...args) => {
    const onSubmitCb = formSubmitHandler || handleSubmit;

    if (onSubmitCb && typeof onSubmitCb === 'function') {
      onSubmitCb(...args);
    }
    goBackToParentUrl();
  }, [formSubmitHandler, goBackToParentUrl, handleSubmit]);

  const onClose = useCallback((...args) => {
    const onCloseCb = formCloseHandler || handleClose;

    if (onCloseCb && typeof onCloseCb === 'function') {
      onCloseCb(...args);
    }
    goBackToParentUrl();
  }, [formCloseHandler, handleClose, goBackToParentUrl]);

  const formKey = useFormInitWithPermissions({ fieldMeta: formMetaData });

  return (
    <>
      <DrawerHeader title={name} handleClose={onClose} />

      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <DynaSubmit formKey={formKey} onClick={onSubmit} >
          Submit
        </DynaSubmit>
      </DrawerFooter>
    </>
  );
}
export default function FormStepDrawer({ integrationId, formSubmitHandler, formCloseHandler }) {
  return (
    <RightDrawer
      path="form/:formType"
      variant="temporary"
      height="tall">
      <FormStepContent
        integrationId={integrationId}
        formSubmitHandler={formSubmitHandler}
        formCloseHandler={formCloseHandler}
      />
    </RightDrawer>
  );
}
