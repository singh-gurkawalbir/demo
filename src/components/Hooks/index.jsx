import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import LoadResources from '../LoadResources';
import getHooksMetadata from './hooksMetadata';
import { resourceData } from '../../reducers';
import {
  isValidHook,
  isValidSuiteScriptHook,
  importHooksList,
  importSuiteScriptHooksList,
} from '../../utils/hooks';

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
  const fieldMeta = useMemo(
    () =>
      getHooksMetadata(resourceType, resource, {
        defaultValue,
        resourceId,
        flowId,
      }),
    [defaultValue, flowId, resource, resourceId, resourceType]
  );
  const getSelectedHooks = useCallback(
    values => {
      const { hookType } = values;
      const selectedHook = {};
      let isInvalidHook = false;
      const hooksList =
        resourceType === 'exports' ? ['preSavePage'] : importHooksList;

      hooksList.forEach(hook => {
        const value = values[`${hookType}-${hook}`];

        if (value) {
          if (!isValidHook(value, true)) {
            isInvalidHook = true;

            return;
          }

          selectedHook[hook] = value;
        }
      });

      return { isInvalidHook, selectedHook };
    },
    [resourceType]
  );
  const getSelectedSuiteScriptHooks = useCallback(
    values => {
      // Extract selected suitescript hooks and validate the same
      const selectedHook = {};
      let isInvalidHook = false;
      const suiteScriptHooksList =
        resourceType === 'exports' ? ['preSend'] : importSuiteScriptHooksList;

      suiteScriptHooksList.forEach(suiteScriptHook => {
        const value = values[`suiteScript-${suiteScriptHook}`];

        if (value) {
          if (!isValidSuiteScriptHook(value, true)) {
            isInvalidHook = true;

            return;
          }

          selectedHook[suiteScriptHook] = value;
        }
      });

      return { isInvalidHook, selectedHook };
    },
    [resourceType]
  );
  const handleSubmit = useCallback(
    values => {
      const selectedValues = {
        hooks: getSelectedHooks(values),
        suiteScriptHooks: getSelectedSuiteScriptHooks(values),
      };

      if (
        selectedValues.hooks.isInvalidHook ||
        selectedValues.suiteScriptHooks.isInvalidHook
      ) {
        return enqueueSnackbar({
          message: 'Please fill the mandatory fields',
          variant: 'error',
        });
      }

      onSave({
        hooks: selectedValues.hooks.selectedHook,
        suiteScriptHooks: selectedValues.suiteScriptHooks.selectedHook,
      });
    },
    [enqueueSnackbar, getSelectedHooks, getSelectedSuiteScriptHooks, onSave]
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
