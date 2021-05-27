import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Button, makeStyles, Paper } from '@material-ui/core';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import {
  getSelectedHooksPatchSet,
  getDefaultValuesForHooks,
  importHooksList,
  getImportSuiteScriptHooksList,
  isValidHook,
  isValidSuiteScriptHook,
} from '../../../../utils/hooks';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import getHooksMetadata from './metadata';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';
import ButtonGroup from '../../../../components/ButtonGroup';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import LoadResources from '../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  paperDefault: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));
export default function HooksForm({flowId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = history.goBack;
  const { resourceType, resourceId } = useParams();

  const disabled = useSelector(state => selectors.isFlowViewMode(state, flowId));

  const { merged: resource } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId,
    'value'
  );

  const defaultValue = useMemo(() => getDefaultValuesForHooks(resource), [
    resource,
  ]);
  const handleSave = useCallback(
    selectedHooks => {
      const patchSet = getSelectedHooksPatchSet(selectedHooks, resource);

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged(resourceType, resourceId, 'value', null, { flowId }));
      dispatch(actions.hooks.save({ resourceType, resourceId, flowId, match }));
    },
    [resource, dispatch, resourceId, resourceType, flowId, match]
  );

  const fieldMeta = useMemo(() =>
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
      onSave: handleSave,
      onClose: handleClose,
    }
  );

  const submitHookValues = closeOnSave => values => {
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
  };
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled,
  });

  return (
    <LoadResources resources="scripts,stacks">
      <DrawerContent>
        <Paper elevation={0} className={classes.paperDefault}>
          <DynaForm dataPublic formKey={formKey} />
        </Paper>
      </DrawerContent>

      <DrawerFooter>
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
          <Button data-test={`cancelHook-${resourceId}`} onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </LoadResources>
  );
}
