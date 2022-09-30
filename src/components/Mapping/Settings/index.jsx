import isEqual from 'lodash/isEqual';
import React, { useMemo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useRouteMatch, useHistory, Redirect, Switch, Route } from 'react-router-dom';
import {selectors} from '../../../reducers';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import EditorDrawer from '../../AFE/Drawer';
import SaveAndCloseResourceForm from '../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';
import { FORM_SAVE_STATUS } from '../../../constants';
import useFormOnCancelContext from '../../FormOnCancelContext';
import MappingsSettingsV2Wrapper from '../../AFE/Editor/panels/Mappings/Mapper2/Settings';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';

const emptySet = [];
const emptyObject = {};

const formKey = 'mappingSettings';

/**
 * disabled property set to true in case of monitor level access
 */
function MappingSettings({
  disabled,
  mappingKey,
  isCategoryMapping,
  ...categoryMappingOpts
}) {
  const history = useHistory();
  const { editorId, integrationId, depth, sectionId } = categoryMappingOpts;
  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {importId, flowId, subRecordMappingId, isGroupedSampleData} = useSelector(state => {
    if (isCategoryMapping) {
      const {importId, flowId} = categoryMappingOpts;

      return {importId, flowId};
    }

    return selectors.mapping(state);
  }, shallowEqual);

  const {value, lookups} = useSelector(state => {
    if (isCategoryMapping) {
      const {mappings, lookups} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);

      const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

      return {value, lookups};
    }
    const { mappings, lookups } = selectors.mapping(state);
    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return {value, lookups};
  }, shallowEqual);

  const generateFields = useSelector(state => {
    if (isCategoryMapping) {
      const {fields: generateFields} = selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
        depth,
      }) || emptyObject;

      return generateFields || emptySet;
    }

    return selectors.mappingGenerates(state, importId, subRecordMappingId);
  });

  const extractFields = useSelector(state => {
    if (isCategoryMapping) {
      return selectors.categoryMappingsExtractsMetadata(state, integrationId, flowId);
    }

    return selectors.mappingExtracts(state, importId, flowId, subRecordMappingId);
  });

  const nsRecordType = useSelector(state =>
    selectors.mappingNSRecordType(state, importId, subRecordMappingId)
  );

  const importResource = useSelector(state =>
    selectors.resource(state, 'imports', importId)
  );

  const hasLookUpOption = useSelector(state =>
    selectors.mappingHasLookupOption(state, 'connections', importResource?._connectionId)
  );

  const { generate, extract, lookupName } = value;
  const fieldMeta = useMemo(
    () => {
      const opts = {
        value,
        flowId,
        extractFields,
        generateFields,
        lookups,
        isCategoryMapping,
        recordType: nsRecordType,
        importResource,
        hasLookUpOption,
        isGroupedSampleData,
      };

      return ApplicationMappingSettings.getMetaData(opts);
    },
    [value, flowId, extractFields, generateFields, lookups, isCategoryMapping, nsRecordType, importResource, hasLookUpOption, isGroupedSampleData]
  );
  const disableSave = useMemo(() => {
    // Disable all fields except useAsAnInitializeValue in case mapping is not editable
    const { fieldMap } = fieldMeta || {};
    const { isNotEditable } = value;

    return disabled || (isNotEditable && !fieldMap.useAsAnInitializeValue);
  }, [disabled, fieldMeta, value]);

  const handleClose = useCallback(
    () => {
      history.goBack();
    },
    [history],
  );
  const patchSettings = useCallback(settings => {
    if (isCategoryMapping) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.patchSettings(
          integrationId,
          flowId,
          editorId,
          mappingKey,
          settings
        )
      );
    } else {
      dispatch(actions.mapping.patchSettings(mappingKey, settings));
    }
  }, [dispatch, editorId, flowId, integrationId, isCategoryMapping, mappingKey]);

  const handleLookupUpdate = useCallback((oldLookup, newLookup) => {
    if (oldLookup && newLookup) {
      const {isConditionalLookup, ..._oldLookup} = oldLookup;

      if (isEqual(_oldLookup, newLookup)) {
        return;
      }
    }

    if (isCategoryMapping) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.updateLookup(
          integrationId,
          flowId,
          editorId,
          oldLookup,
          newLookup
        )
      );
    } else {
      dispatch(actions.mapping.updateLookup({oldValue: oldLookup, newValue: newLookup, isConditionalLookup: false}));
    }
  }, [dispatch, editorId, flowId, integrationId, isCategoryMapping]);
  const formVal = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const [count, setCount] = useState(0);
  const handleSubmit = useCallback(
    closeAfterSave => {
      const oldLookupValue = lookupName && lookups.find(lookup => lookup.name === lookupName);
      const {
        settings,
        lookup: updatedLookup,
        errorMessage,
      } = ApplicationMappingSettings.getFormattedValue(
        { generate, extract, lookup: oldLookupValue },
        formVal
      );

      if (errorMessage) {
        enquesnackbar({
          message: errorMessage,
          variant: 'error',
        });

        return;
      }
      handleLookupUpdate(oldLookupValue, updatedLookup);
      patchSettings(settings);
      if (closeAfterSave) {
        handleClose();

        return;
      }
      setCount(count => count + 1);
    },
    [enquesnackbar, extract, formVal, generate, handleLookupUpdate, lookupName, lookups, patchSettings, handleClose]
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
          disableOnCloseAfterSave
          status={FORM_SAVE_STATUS.COMPLETE}
          disabled={disableSave}
        />
      </DrawerFooter>
    </>
  );
}

function MappingSettingsWrapper(props) {
  const match = useRouteMatch();

  const { mappingKey } = match.params;
  const isSettingsConfigured = useSelector(state => {
    const {mappings} = selectors.mapping(state);
    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return !!value?.generate;
  });

  if (!isSettingsConfigured) {
    return <Redirect push={false} to={`${match.url.substr(0, match.url.indexOf('/settings'))}`} />;
  }

  return (
    <MappingSettings {...props} mappingKey={mappingKey} />
  );
}
function CategoryMappingSettingsWrapper(props) {
  const { integrationId, flowId, importId } = props;
  const match = useRouteMatch();
  const { editorId, mappingKey, depth, sectionId } = match.params;
  const isSettingsConfigured = useSelector(state => {
    const {mappings} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);
    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return !!value?.generate;
  });

  if (!isSettingsConfigured) {
    return <Redirect push={false} to={`${match.url.substr(0, match.url.indexOf('/settings'))}`} />;
  }

  return (
    <MappingSettings
      {...props}
      isCategoryMapping
      integrationId={integrationId}
      flowId={flowId}
      importId={importId}
      editorId={editorId}
      sectionId={sectionId}
      depth={depth}
      mappingKey={mappingKey}
    />
  );
}

function Title() {
  const match = useRouteMatch();
  const {nodeKey, generate} = match.params;

  if (!nodeKey) return 'Settings';

  return `Settings - destination field: ${generate}`;
}
export default function SettingsDrawer(props) {
  const match = useRouteMatch();
  const {setCancelTriggered} = useFormOnCancelContext(formKey);

  // TODO @Raghu: Back button is not automatically shown for category mapping settings
  // Hence added showBackButton.. Revisit
  return (
    <RightDrawer
      onClose={setCancelTriggered}
      path={[
        drawerPaths.MAPPINGS.V2_SETTINGS,
        drawerPaths.MAPPINGS.SETTINGS,
        drawerPaths.MAPPINGS.CATEGORY_MAPPING_SETTINGS,
      ]}
      height="tall"
    >

      {/* handleBack is added for v2 mapping settings as back button needs to update the active key as well */}
      <DrawerHeader
        helpTitle="Settings"
        helpKey="afe.mappings.settings"
        title={<Title />}
        showBackButton
        handleBack={setCancelTriggered} />
      <Switch>
        <Route
          path={buildDrawerUrl({ path: drawerPaths.MAPPINGS.CATEGORY_MAPPING_SETTINGS, baseUrl: match.url })}>
          <CategoryMappingSettingsWrapper {...props} />
        </Route>
        <Route
          path={buildDrawerUrl({ path: drawerPaths.MAPPINGS.V2_SETTINGS, baseUrl: match.url })}>
          <MappingsSettingsV2Wrapper {...props} />
        </Route>
        <Route
          path={buildDrawerUrl({ path: drawerPaths.MAPPINGS.SETTINGS, baseUrl: match.url })}>
          <MappingSettingsWrapper {...props} />
        </Route>

      </Switch>
      <EditorDrawer />

    </RightDrawer>
  );
}
