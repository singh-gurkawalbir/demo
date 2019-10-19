import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function HooksDialog({ flowId, resource, resourceType, open, onClose }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const resourceId = resource._id;
  const defaultValue = (resource.hooks && resource.hooks.preSavePage) || {};
  const onSave = selectedHook => {
    const hooks = { preSavePage: selectedHook };
    const patchSet = [{ op: 'replace', path: '/hooks', value: hooks }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    onClose();
  };

  return (
    <Dialog open={open} PaperProps={{ className: classes.paper }}>
      <DialogTitle>Hooks</DialogTitle>
      <DialogContent>
        <Hooks
          onSave={onSave}
          onCancel={onClose}
          defaultValue={defaultValue}
          resourceType={resourceType}
          resourceId={resourceId}
          flowId={flowId}
        />
      </DialogContent>
    </Dialog>
  );
}

function LookupHooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'lookupHooks',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: LookupHooks,
};
