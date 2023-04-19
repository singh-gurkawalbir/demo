import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
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
import getHooksMetadata from './metadata';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import LoadResources from '../../../../components/LoadResources';
import SaveAndCloseButtonGroupForm from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import IsLoggableContextProvider from '../../../../components/IsLoggableContextProvider';

const useStyles = makeStyles(theme => ({
  paperDefault: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));
export default function HooksForm({flowId, integrationId, formKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = history.goBack;
  const { resourceType, resourceId } = useParams();

  const disabled = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));

  const { merged: resource } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId,
  );

  const defaultValue = useMemo(() => getDefaultValuesForHooks(resource), [
    resource,
  ]);
  const handleSave = useCallback(
    selectedHooks => {
      const patchSet = getSelectedHooksPatchSet(selectedHooks, resource, resourceType);

      dispatch(actions.resource.patchAndCommitStaged(resourceType, resourceId, patchSet, {
        context: { flowId },
        asyncKey: formKey,
      }));

      dispatch(actions.hooks.save({ resourceType, resourceId, flowId, match }));
    },
    [resource, dispatch, resourceId, resourceType, flowId, match, formKey]
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
        resourceType === 'exports' ? ['preSend'] : getImportSuiteScriptHooksList((resource?.netsuite_da?.restletVersion === 'suiteapp2.0' || resource?.netsuite_da?.useSS2Restlets));

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
    [resourceType, resource?.netsuite_da?.restletVersion, resource?.netsuite_da?.useSS2Restlets] // eslint-disable-line camelcase

  );
  const [count, setCount] = useState(0);

  const remountFn = useCallback(() => {
    setCount(count => count + 1);
  }, []);

  useFormInitWithPermissions({
    fieldMeta,
    disabled,
    formKey,
    remount: count,
  });

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const submitHookValues = () => {
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

    handleSave({
      hooks: selectedValues.hooks.selectedHook,
      suiteScriptHooks: selectedValues.suiteScriptHooks.selectedHook,
    });
  };

  return (
    <LoadResources resources="scripts,stacks">
      <DrawerContent>
        <Paper elevation={0} className={classes.paperDefault}>
          <IsLoggableContextProvider isLoggable>
            <DynaForm formKey={formKey} />
          </IsLoggableContextProvider>
        </Paper>
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          remountAfterSaveFn={remountFn}
          formKey={formKey}
          onSave={submitHookValues}
          onClose={handleClose}
          />
      </DrawerFooter>
    </LoadResources>
  );
}
