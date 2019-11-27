import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';
import ModalDialog from '../../../../components/ModalDialog';

function HooksDialog({
  flowId,
  resource,
  resourceType,
  isViewMode,
  open,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const defaultValue = resource.hooks || {};
  const onSave = selectedHook => {
    const patchSet = [{ op: 'replace', path: '/hooks', value: selectedHook }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged(resourceType, resourceId, 'value'));
    onClose();
  };

  return (
    <ModalDialog
      show={open}
      disabled={isViewMode}
      onClose={onClose}
      minWidth="sm">
      <div>Hooks</div>
      <Hooks
        onSave={onSave}
        disabled={isViewMode}
        onCancel={onClose}
        defaultValue={defaultValue}
        resourceType={resourceType}
        resourceId={resourceId}
        flowId={flowId}
      />
    </ModalDialog>
  );
}

function PageProcessorHooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'pageProcessorHooks',
  position: 'middle',
  Icon,
  Component: PageProcessorHooks,
};
