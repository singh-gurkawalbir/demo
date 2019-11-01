import { Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import { resourceData } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/FilterIcon';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ProceedOnFailureDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { open, onClose, flowId, resourceIndex } = props;
  const { merged: flow = {} } = useSelector(state =>
    resourceData(state, 'flows', flowId)
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
    <Dialog open={open} PaperProps={{ className: classes.paper }}>
      <DialogTitle>
        What should happen to a record if the lookup fails?
      </DialogTitle>
      <DialogContent>
        <DynaForm fieldMeta={fieldMeta}>
          <Button data-test="cancelProceedOnFailure" onClick={onClose}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveProceedOnFailure" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
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
