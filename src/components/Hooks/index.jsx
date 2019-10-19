import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import LoadResources from '../LoadResources';
import getHooksMetadata from './hooksMetadata';
import { resourceData } from '../../reducers';
import { isValidHook, importHooksList } from '../../utils/hooks';

export default function Hooks(props) {
  const {
    onSave,
    onCancel,
    defaultValue = {},
    resourceType = 'exports',
    resourceId,
    flowId,
  } = props;
  const [enquesnackbar] = useEnqueueSnackbar();
  const defaultHookType =
    defaultValue && defaultValue._stackId ? 'stack' : 'script';
  const { merged: resource } = useSelector(state =>
    resourceData(state, resourceType, resourceId, 'value')
  );
  const fieldMeta = getHooksMetadata(resourceType, resource, {
    defaultHookType,
    defaultValue,
    resourceId,
    flowId,
  });
  const handleSubmit = values => {
    const { hookType } = values;
    const selectedHook = {};
    let isInvalidHook = false;

    if (resourceType === 'exports') {
      const value = values[`${hookType}-preSavePage`];

      if (!isValidHook(value)) {
        isInvalidHook = true;
      } else {
        selectedHook.preSavePage = value;
      }
    } else {
      importHooksList.forEach(hook => {
        const value = values[`${hookType}-${hook}`];

        if (value) {
          if (!isValidHook(value, true)) {
            isInvalidHook = true;

            return;
          }

          selectedHook[hook] = value;
        }
      });
    }

    if (isInvalidHook) {
      return enquesnackbar({
        message: 'Please fill the mandatory fields',
        variant: 'error',
      });
    }

    onSave(selectedHook);
  };

  return (
    <LoadResources resources="scripts, stacks">
      <div>
        <DynaForm fieldMeta={fieldMeta}>
          <Button data-test={`cancelHook-${resourceId}`} onClick={onCancel}>
            Cancel
          </Button>
          <DynaSubmit
            data-test={`saveHook-${resourceId}`}
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </div>
    </LoadResources>
  );
}
