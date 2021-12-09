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

function FormStepContent({ integrationId, addChild, formSubmitHandler, formCloseHandler }) {
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
  const handleSubmit = useCallback(
    formVal => {
      if (installerFunction) {
        // For IA1.0
        if (addChild) {
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
      history.goBack();
    },
    [dispatch, history, installerFunction, integrationId, addChild]
  );
  const onClose = useCallback(() => {
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, '', 'failed')
    );
    history.goBack();
  }, [dispatch, integrationId, history]);

  const formKey = useFormInitWithPermissions({ fieldMeta: formMetaData });

  return (
    <>
      <DrawerHeader title={name} handleClose={formCloseHandler || onClose} />

      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <DynaSubmit formKey={formKey} onClick={formSubmitHandler || handleSubmit} >
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
