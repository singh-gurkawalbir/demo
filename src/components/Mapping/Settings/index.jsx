import isEqual from 'lodash/isEqual';
import React, { useMemo, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useRouteMatch, useHistory, Redirect, Switch, Route } from 'react-router-dom';
import {selectors} from '../../../reducers';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import RightDrawer from '../../drawer/Right';
import ButtonGroup from '../../ButtonGroup';

const emptySet = [];
const emptyObject = {};

/**
 *
 * disabled property set to true in case of monitor level access
 */

function MappingSettings({
  disabled,
  mappingKey,
  isCategoryMapping,
  ...categoryMappingOpts
}) {
  const history = useHistory();
  const { sectionId, editorId, integrationId, mappingIndex} = categoryMappingOpts;

  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {importId, flowId, subRecordMappingId} = useSelector(state => {
    if (isCategoryMapping) {
      const {importId, flowId} = categoryMappingOpts;

      return {importId, flowId};
    }

    return selectors.mapping(state);
  }, shallowEqual);

  const {value, lookups} = useSelector(state => {
    if (isCategoryMapping) {
      const {mappings, lookups} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);

      return {value: mappings[mappingIndex], lookups};
    }
    const { mappings, lookups } = selectors.mapping(state);
    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return {value, lookups};
  }, shallowEqual);

  const generateFields = useSelector(state => {
    if (isCategoryMapping) {
      const {fields: generateFields} = selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
      }) || emptyObject;

      return generateFields || emptySet;
    }

    return selectors.mappingGenerates(state, importId, subRecordMappingId);
  });

  const extractFields = useSelector(state => {
    if (isCategoryMapping) {
      return selectors.categoryMappingMetadata(state, integrationId, flowId).extractsMetadata;
    }

    return selectors.mappingExtracts(state, importId, flowId, subRecordMappingId);
  });

  const nsRecordType = useSelector(state =>
    selectors.mappingNSRecordType(state, importId, subRecordMappingId)
  );

  const importResource = useSelector(state =>
    selectors.resource(state, 'imports', importId)
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
      };

      return ApplicationMappingSettings.getMetaData(opts);
    },
    [value, flowId, extractFields, generateFields, lookups, isCategoryMapping, nsRecordType, importResource]
  );
  const disableSave = useMemo(() => {
    // Disable all fields except useAsAnInitializeValue in case mapping is not editable
    const { fieldMap } = fieldMeta || {};
    const { isNotEditable } = value;

    return disabled || (isNotEditable && !fieldMap.useAsAnInitializeValue);
  }, [disabled, fieldMeta, value]);

  const hadleClose = useCallback(
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
          mappingIndex,
          settings
        )
      );
    } else {
      dispatch(actions.mapping.patchSettings(mappingKey, settings));
    }

    hadleClose();
  }, [dispatch, editorId, flowId, hadleClose, integrationId, isCategoryMapping, mappingIndex, mappingKey]);

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
  const handleSubmit = useCallback(
    formVal => {
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
    },
    [enquesnackbar, extract, generate, handleLookupUpdate, lookupName, lookups, patchSettings]
  );

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <>
      <DynaForm
        formKey={formKey}
        fieldMeta={fieldMeta} />
      <ButtonGroup>
        <DynaSubmit
          formKey={formKey}
          disabled={disableSave}
          id="fieldMappingSettingsSave"
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <Button
          data-test="fieldMappingSettingsCancel"
          onClick={hadleClose}
          variant="text"
          color="primary">
          Cancel
        </Button>
      </ButtonGroup>
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
    <MappingSettings
      {...props}
      mappingKey={mappingKey}
    />
  );
}
function CategoryMappingSettingsWrapper(props) {
  const { integrationId, flowId, importId} = props;
  const match = useRouteMatch();
  const { editorId, mappingIndex } = match.params;
  const isSettingsConfigured = useSelector(state => {
    const {mappings} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);

    return !!mappings?.[mappingIndex]?.generate;
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
      mappingIndex={mappingIndex}
    />
  );
}
export default function SettingsDrawer(props) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      hideBackButton
      path={[
        'settings/:mappingKey',
        'settings/category/:editorId/:mappingIndex',
      ]}
      title="Settings"
      height="tall"
    >
      <Switch>
        <Route
          path={`${match.url}/settings/category/:editorId/:mappingIndex`}>
          <CategoryMappingSettingsWrapper
            {...props} />
        </Route>
        <Route
          path={`${match.url}/settings/:mappingKey`}>
          <MappingSettingsWrapper
            {...props} />
        </Route>

      </Switch>
    </RightDrawer>
  );
}
