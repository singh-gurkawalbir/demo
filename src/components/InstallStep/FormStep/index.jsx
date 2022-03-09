import React, { useMemo, useCallback } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
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

function FormStepContent({ integrationId, formSubmitHandler, formCloseHandler, parentUrl }) {
  const { formType } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentStep = useSelector(
    state => selectors.currentStepPerMode(state, { mode: formType, integrationId })
  );

  if (!currentStep || !currentStep.isTriggered) {
    // When the url is invalid or When the step is either completed/failed
    // isTriggered is false and goes back to parent url
    history.replace(parentUrl);
  }
  const { installerFunction, name, formMeta, form } = currentStep || {};

  const formMetaData = useMemo(() => {
    if (formType === 'install') {
      return formMeta;
    }

    return form;
  }, [formType, formMeta, form]);

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
  }, [formSubmitHandler, handleSubmit]);

  const onClose = useCallback((...args) => {
    const onCloseCb = formCloseHandler || handleClose;

    if (onCloseCb && typeof onCloseCb === 'function') {
      onCloseCb(...args);
    }
  }, [formCloseHandler, handleClose]);

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
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="form/:formType"
      variant="temporary"
      height="tall">
      <FormStepContent
        integrationId={integrationId}
        formSubmitHandler={formSubmitHandler}
        formCloseHandler={formCloseHandler}
        parentUrl={match.url}
      />
    </RightDrawer>
  );
}
