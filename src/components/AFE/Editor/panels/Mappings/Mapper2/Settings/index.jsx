import React, { useMemo, useCallback, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch, useHistory, Redirect} from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import useEnqueueSnackbar from '../../../../../../../hooks/enqueueSnackbar';
import {selectors} from '../../../../../../../reducers';
import useFormInitWithPermissions from '../../../../../../../hooks/useFormInitWithPermissions';
import DrawerContent from '../../../../../../drawer/Right/DrawerContent';
import DynaForm from '../../../../../../DynaForm';
import DrawerFooter from '../../../../../../drawer/Right/DrawerFooter';
import SaveAndCloseResourceForm from '../../../../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';
import { FORM_SAVE_STATUS } from '../../../../../../../utils/constants';
import actions from '../../../../../../../actions';
import { findNodeInTree } from '../../../../../../../utils/mapping';
import ApplicationMappingSettings from './application';

const emptyObject = {};

const formKey = 'mappingSettings';

function MappingSettingsV2({
  disabled,
  nodeKey,
}) {
  const history = useHistory();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const {importId, flowId, isGroupedSampleData} = useSelector(state => selectors.mapping(state), shallowEqual);

  const {node, lookups} = useSelector(state => {
    const {lookups, v2TreeData = []} = selectors.mapping(state);

    const {node = emptyObject} = findNodeInTree(v2TreeData, 'key', nodeKey);

    return {node, lookups};
  }, shallowEqual);

  const importResource = useSelectorMemo(selectors.makeResourceSelector, 'imports', importId);

  const { generate, extract, lookupName } = node;
  const fieldMeta = useMemo(
    () => {
      const opts = {
        node,
        flowId,
        lookups,
        importResource,
        isGroupedSampleData,
      };

      return ApplicationMappingSettings.getMetaData(opts);
    },
    [flowId, importResource, isGroupedSampleData, lookups, node]
  );

  const handleClose = useCallback(() => {
    dispatch(actions.mapping.v2.updateActiveKey(''));
    history.goBack();
  },
  [dispatch, history]);

  const patchSettings = useCallback(settings => {
    dispatch(actions.mapping.v2.patchSettings(nodeKey, settings));
  }, [dispatch, nodeKey]);

  const handleLookupUpdate = useCallback((oldLookup, newLookup) => {
    if (oldLookup && newLookup) {
      const {isConditionalLookup, ..._oldLookup} = oldLookup;

      if (isEqual(_oldLookup, newLookup)) {
        return;
      }
    }

    dispatch(actions.mapping.updateLookup({oldValue: oldLookup, newValue: newLookup, isConditionalLookup: false}));
  }, [dispatch]);

  const formVal = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleSubmit = useCallback(
    closeAfterSave => {
      const oldLookupValue = lookupName && lookups.find(lookup => lookup.name === lookupName);
      const {
        settings,
        updatedLookup,
        errorMessage,
      } = ApplicationMappingSettings.getFormattedValue(
        { generate, extract, lookup: oldLookupValue },
        formVal,
        importResource
      );

      if (errorMessage) {
        enqueueSnackbar({
          message: errorMessage,
          variant: 'error',
        });

        return;
      }
      handleLookupUpdate(oldLookupValue, updatedLookup);
      patchSettings(settings);
      if (closeAfterSave) {
        return;
      }
      setCount(count => count + 1);
    },
    [enqueueSnackbar, extract, formVal, handleLookupUpdate, generate, lookupName, lookups, patchSettings, importResource]
  );

  useFormInitWithPermissions({
    formKey,
    disabled,
    remount: count,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseResourceForm
          formKey={formKey}
          onClose={handleClose}
          onSave={handleSubmit}
          status={FORM_SAVE_STATUS.COMPLETE}
          disabled={disabled}
          />
      </DrawerFooter>
    </>
  );
}

export default function MappingsSettingsV2Wrapper(props) {
  const match = useRouteMatch();
  const { nodeKey, generate } = match.params;

  if (!generate) {
    return <Redirect push={false} to={`${match.url.substr(0, match.url.indexOf('/settings'))}`} />;
  }

  return (
    <MappingSettingsV2 {...props} nodeKey={nodeKey} />
  );
}
