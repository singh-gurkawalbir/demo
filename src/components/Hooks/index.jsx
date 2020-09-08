import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useMemo } from 'react';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import {
  importHooksList,
  getImportSuiteScriptHooksList,
  isValidHook,
  isValidSuiteScriptHook,
} from '../../utils/hooks';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import LoadResources from '../LoadResources';
import getHooksMetadata from './hooksMetadata';
import useSaveStatusIndicator from '../../hooks/useSaveStatusIndicator';
import ButtonGroup from '../ButtonGroup';

const useStyles = makeStyles(theme => ({
  fbContDrawer: {
    width: '100%',
    overflowX: 'hidden',
    paddingTop: theme.spacing(2),
  },
  actionButtons: {
    padding: theme.spacing(3, 0),
  },
}));

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
  const classes = useStyles();
  const { merged: resource } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId,
    'value'
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
        // eslint-disable-next-line camelcase
        resourceType === 'exports' ? ['preSend'] : getImportSuiteScriptHooksList(resource?.netsuite_da?.useSS2Restlets);

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
    [resourceType, resource?.netsuite_da?.useSS2Restlets] // eslint-disable-line camelcase

  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/${resourceType}/${resourceId}`,
      disabled,
      onSave,
      onClose: onCancel,
    }
  );

  const submitHookValues = useCallback(
    closeOnSave => values => {
      const selectedValues = {
        hooks: getSelectedHooks(values),
        suiteScriptHooks: getSelectedSuiteScriptHooks(values),
      };

      if (
        selectedValues.hooks.isInvalidHook ||
        selectedValues.suiteScriptHooks.isInvalidHook
      ) {
        return null;
      }

      submitHandler(closeOnSave)({
        hooks: selectedValues.hooks.selectedHook,
        suiteScriptHooks: selectedValues.suiteScriptHooks.selectedHook,
      });
    },
    [getSelectedHooks, getSelectedSuiteScriptHooks, submitHandler]
  );
  // console.log('RENDER: Hooks');
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled,
  });

  return (
    <LoadResources resources="scripts,stacks">
      <div className={classes.fbContDrawer}>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <div className={classes.actionButtons}>
          <ButtonGroup>
            <DynaSubmit
              formKey={formKey}
              disabled={disableSave}
              data-test={`saveHook-${resourceId}`}
              onClick={submitHookValues()}>
              {defaultLabels.saveLabel}
            </DynaSubmit>
            <DynaSubmit
              formKey={formKey}
              disabled={disableSave}
              color="secondary"
              data-test={`saveAndCloseHook-${resourceId}`}
              onClick={submitHookValues(true)}>
              {defaultLabels.saveAndCloseLabel}
            </DynaSubmit>
            <Button data-test={`cancelHook-${resourceId}`} onClick={onCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </LoadResources>
  );
}
