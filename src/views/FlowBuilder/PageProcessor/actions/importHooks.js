import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';

function HooksDialog({ flowId, resource, resourceType, open, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const defaultValue = (resource.hooks && resource.hooks.preSavePage) || {};
  const onSave = selectedHook => {
    const patchSet = [{ op: 'replace', path: '/hooks', value: selectedHook }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Hooks</Typography>
      </DialogTitle>
      <DialogContent>
        <Hooks
          onSave={onSave}
          onCancel={onClose}
          defaultValue={defaultValue}
          flowId={flowId}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </DialogContent>
    </Dialog>
  );
}

function ImportHooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importHooks',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ImportHooks,
};
