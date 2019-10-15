import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';

function HooksDialog({ flowId, resource, open, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'hooks', true)
  );
  const onSave = selectedHook => {
    const hooks = { preSavePage: selectedHook };
    const patchSet = [{ op: 'replace', path: '/hooks', value: hooks }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          'exports',
          'hooks',
          true
        )
      );
    }
  }, [dispatch, flowId, resourceId, sampleData]);

  return (
    <Dialog open={open}>
      <DialogTitle>Hooks</DialogTitle>
      <DialogContent>
        <Hooks onSave={onSave} onCancel={onClose} preHookData={sampleData} />
      </DialogContent>
    </Dialog>
  );
}

function ExportHooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportHooks',
  position: 'right',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ExportHooks,
};
