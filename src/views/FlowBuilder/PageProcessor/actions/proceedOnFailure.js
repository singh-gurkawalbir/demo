import React, { useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import DynaForm from '../../../../components/DynaForm';
import Icon from '../../../../components/icons/AgentsIcon';
import ModalDialog from '../../../../components/ModalDialog';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import SaveAndCloseButtonGroupForm from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useHandleCancel from '../../../../components/SaveAndCloseButtonGroup/hooks/useHandleCancel';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';

const emptyObject = {};

const formKey = 'proceedOnFailure';

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
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;

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

  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const saveFormValues = useCallback(() => {
    const { proceedOnFailure } = formValues;
    const patchSet = [
      {
        op: 'replace',
        path: `/pageProcessors/${resourceIndex}/proceedOnFailure`,
        value: proceedOnFailure === 'true',
      },
    ];

    dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flowId, 'value', null, null, formKey));
  }, [dispatch, flowId, formValues, resourceIndex]);

  const [count, setCount] = useState(0);

  const remountAfterSaveFn = useCallback(() => {
    setCount(count => count + 1);
  }, []);

  useFormInitWithPermissions({
    fieldMeta,
    disabled: isViewMode,
    formKey,
    remount: count,
  });

  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey)); // get the status from the selector
  const isSaving = status === FORM_SAVE_STATUS.LOADING;

  const onCloseWithDirtyChangesDialog = useHandleCancel({formKey, onClose, handleSave: saveFormValues});

  return (
    <ModalDialog show={open} onClose={onCloseWithDirtyChangesDialog} disableClose={isSaving}>
      <div>
        {title}
      </div>
      <div>
        <DynaForm
          formKey={formKey} />
      </div>
      <div>
        <SaveAndCloseButtonGroupForm
          formKey={formKey}
          disabled={isViewMode}
          onClose={onClose}
          remountAfterSaveFn={remountAfterSaveFn}
          onSave={saveFormValues}

       />
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
