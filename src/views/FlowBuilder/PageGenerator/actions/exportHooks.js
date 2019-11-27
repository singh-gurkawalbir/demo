import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';
import helpTextMap from '../../../../components/Help/helpTextMap';
import ModalDialog from '../../../../components/ModalDialog';

const useStyles = makeStyles(() => ({
  wrapper: {
    minWidth: 580,
  },
}));

function HooksDialog({ flowId, isViewMode, resource, open, onClose }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const resourceId = resource._id;
  const resourceType = 'exports';
  const defaultValue = resource.hooks || {};
  const onSave = selectedHook => {
    const patchSet = [{ op: 'replace', path: '/hooks', value: selectedHook }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged(resourceType, resourceId, 'value'));
    onClose();
  };

  return (
    <ModalDialog show={open} onClose={onClose} disabled={isViewMode}>
      <div className={classes.wrapper}>Hooks</div>
      <Hooks
        onSave={onSave}
        onCancel={onClose}
        disabled={isViewMode}
        defaultValue={defaultValue}
        flowId={flowId}
        resourceId={resourceId}
        resourceType={resourceType}
      />
    </ModalDialog>
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
  helpText: helpTextMap['fb.pg.exports.hooks'],
  Component: ExportHooks,
};
