import Button from '@material-ui/core/Button';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import Icon from '../../../../components/icons/AgentsIcon';
import ModalDialog from '../../../../components/ModalDialog';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../reducers';

const emptyObject = {};

function ProceedOnFailureDialog(props) {
  const dispatch = useDispatch();
  const {
    open,
    onClose,
    flowId,
    resourceIndex,
    isViewMode,
    resourceType,
  } = props;
  const [closeOnSave, setCloseOnSave] = useState(false);
  const [disableSave, setDisableSave] = useState(isViewMode);
  const { merged: flow = emptyObject } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  );

  const commStatus = useSelector(state =>
    selectors.commStatusPerPath(state, `/flows/${flowId}`, 'put'));

  const {saveLabel, saveAndCloseLabel} = useMemo(() => {
    const isSaving = commStatus === 'loading';
    const saveLabel = (isSaving && !closeOnSave) ? 'Saving' : 'Save';
    const saveAndCloseLabel = (isSaving && closeOnSave) ? 'Saving' : 'Save & close';
    return {saveLabel, saveAndCloseLabel};
  }, [closeOnSave, commStatus]);

  const { pageProcessors = [] } = flow;
  const defaultValue = !!(
    pageProcessors[resourceIndex] &&
    pageProcessors[resourceIndex].proceedOnFailure
  );
  const title = `What should happen to a record if the ${
    resourceType === 'exports' ? 'lookup' : 'import'
  } fails?`;
  const fieldMeta = {
    fieldMap: {
      proceedOnFailure: {
        id: 'proceedOnFailure',
        name: 'proceedOnFailure',
        type: 'radiogroup',
        label: 'The failed record should',
        defaultValue: defaultValue ? 'true' : 'false',
        fullWidth: true,
        options: [
          {
            items: [
              {
                label: 'Proceed to the next application regardless',
                value: 'true',
              },
              {
                label: 'Pause here until someone can fix the error.',
                value: 'false',
              },
            ],
          },
        ],
      },
    },
    layout: {
      fields: ['proceedOnFailure'],
    },
  };
  const saveFormValues = useCallback(formValues => {
    const { proceedOnFailure } = formValues;
    const patchSet = [
      {
        op: 'replace',
        path: `/pageProcessors/${resourceIndex}/proceedOnFailure`,
        value: proceedOnFailure === 'true',
      },
    ];

    dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
  }, [dispatch, flowId, resourceIndex]);

  const handleSave = useCallback(
    (formValues) => {
      saveFormValues(formValues);
      setCloseOnSave(false);
      setDisableSave(true);
    },
    [saveFormValues],
  );

  const handleSaveAndClose = useCallback(
    formValues => {
      saveFormValues(formValues);
      setCloseOnSave(true);
      setDisableSave(true);
    },
    [saveFormValues],
  );

  useEffect(() => {
    if (commStatus === 'success') {
      setDisableSave(false);
      if (closeOnSave) {
        onClose();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commStatus]);

  return (
    <ModalDialog show={open} onClose={onClose}>
      <div>
        {title}
      </div>
      <div>
        <DynaForm disabled={isViewMode} fieldMeta={fieldMeta}>
          <DynaSubmit
            disabled={disableSave}
            data-test="saveProceedOnFailure"
            onClick={handleSave}>
            {saveLabel}
          </DynaSubmit>
          <DynaSubmit
            disabled={disableSave}
            data-test="saveProceedOnFailure"
            onClick={handleSaveAndClose}>
            {saveAndCloseLabel}
          </DynaSubmit>
          <Button data-test="cancelProceedOnFailure" onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}

function ProceedOnFailure(props) {
  const { open } = props;

  return <>{open && <ProceedOnFailureDialog {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'proceedOnFailure',
  position: 'right',
  Icon,
  Component: ProceedOnFailure,
};
