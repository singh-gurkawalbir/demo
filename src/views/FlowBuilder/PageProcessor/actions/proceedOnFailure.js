import Button from '@material-ui/core/Button';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
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
  const { open, onClose, flowId, resourceIndex, isViewMode } = props;
  const { merged: flow = emptyObject } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  );
  const { pageProcessors = [] } = flow;
  const defaultValue = !!(
    pageProcessors[resourceIndex] &&
    pageProcessors[resourceIndex].proceedOnFailure
  );
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
  const handleSubmit = formValues => {
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
    onClose();
  };

  return (
    <ModalDialog show={open} onClose={onClose}>
      <div> What should happen to a record if the lookup fails?</div>
      <div>
        <DynaForm disabled={isViewMode} fieldMeta={fieldMeta}>
          <DynaSubmit
            disabled={isViewMode}
            data-test="saveProceedOnFailure"
            onClick={handleSubmit}>
            Save
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

  return <Fragment>{open && <ProceedOnFailureDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'proceedOnFailure',
  position: 'right',
  Icon,
  Component: ProceedOnFailure,
};
