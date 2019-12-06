import { useCallback } from 'react';
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
    disabled,
    resourceType = 'exports',
    resourceId,
    flowId,
  } = props;
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { merged: resource } = useSelector(state =>
    resourceData(state, resourceType, resourceId, 'value')
  );
  const fieldMeta = getHooksMetadata(resourceType, resource, {
    defaultValue,
    resourceId,
    flowId,
  });
  const handleSubmit = useCallback(
    values => {
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
        return enqueueSnackbar({
          message: 'Please fill the mandatory fields',
          variant: 'error',
        });
      }

      onSave(selectedHook);
    },
    [enqueueSnackbar, onSave, resourceType]
  );

  // console.log('RENDER: Hooks');

  return (
    <LoadResources resources="scripts, stacks">
      <div>
        <DynaForm fieldMeta={fieldMeta} disabled={disabled}>
          <DynaSubmit
            disabled={disabled}
            data-test={`saveHook-${resourceId}`}
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button data-test={`cancelHook-${resourceId}`} onClick={onCancel}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </LoadResources>
  );
}
