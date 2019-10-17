import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';

function HooksDialog({ flowId, resource, resourceType, open, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const defaultValue = (resource.hooks && resource.hooks.preSavePage) || {};
  const preHookData = useSelector(state => {
    const sampleData = selectors.getSampleData(
      state,
      flowId,
      resourceId,
      'hooks'
    );

    if (sampleData) {
      // @TODO Raghu Finalize on the structure
      return { errors: [], data: [sampleData] };
    }
  });
  const preHookDataStatus = useSelector(state =>
    selectors.getSampleDataStatus(state, flowId, resourceId, 'hooks')
  );
  const onSave = selectedHook => {
    const hooks = { preSavePage: selectedHook };
    const patchSet = [{ op: 'replace', path: '/hooks', value: hooks }];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    onClose();
  };

  useEffect(() => {
    if (!preHookData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          'hooks'
        )
      );
    }
  }, [dispatch, flowId, preHookData, resourceId, resourceType]);

  return (
    <Dialog open={open}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Hooks</Typography>
      </DialogTitle>
      <DialogContent>
        <Hooks
          onSave={onSave}
          onCancel={onClose}
          preHookData={preHookData}
          preHookDataStatus={preHookDataStatus}
          defaultValue={defaultValue}
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
