import React, { useState, useMemo, useCallback } from 'react';
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
import RightDrawer from '../../drawer/Right';

const emptySet = {};
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
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });

  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {resourceId: importId, flowId, subRecordMappingId} = useSelector(state => {
    if (isCategoryMapping) {
      return {resourceId: categoryMappingOpts.importId, flowId: categoryMappingOpts.flowId};
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

  // TODO(Aditya): copied from MappingRow. Talk to Ashok over simlification of ths
  const updateLookup = useCallback((lookupOps = []) => {
    let lookupsTmp = [...lookups];

    // Here lookupOPs will be an array of lookups and actions. Lookups can be added and delted simultaneously from settings.
    lookupOps.forEach(({ isDelete, obj }) => {
      if (isDelete) {
        lookupsTmp = lookupsTmp.filter(lookup => lookup.name !== obj.name);
      } else {
        const index = lookupsTmp.findIndex(lookup => lookup.name === obj.name);

        if (index !== -1) {
          lookupsTmp[index] = obj;
        } else {
          lookupsTmp.push(obj);
        }
      }
    });

    if (isCategoryMapping) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.updateLookup(
          integrationId,
          flowId,
          editorId,
          lookupsTmp
        )
      );
    } else {
      dispatch(actions.mapping.updateLookup(lookupsTmp));
    }
  }, [dispatch, editorId, flowId, integrationId, isCategoryMapping, lookups]);
  const hadleClose = useCallback(
    () => {
      history.goBack();
    },
    [history],
  );
  const patchCategoryMappingSettings = useCallback(settings => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.patchSettings(
        integrationId,
        flowId,
        editorId,
        mappingIndex,
        settings
      )
    );
    hadleClose();
  }, [dispatch, editorId, flowId, hadleClose, integrationId, mappingIndex]);

  const patchMappingSettings = useCallback(settings => {
    dispatch(actions.mapping.patchSettings(mappingKey, settings));
    hadleClose();
  }, [dispatch, hadleClose, mappingKey]);

  const handleLookupUpdate = useCallback((oldLookup, newLookup, conditionalLookup) => {
    const lookupObj = [];

    if (newLookup) {
      lookupObj.push({ isDelete: false, obj: newLookup });
    } else if (oldLookup) {
      // When user tries to reconfigure setting and tries to remove lookup, delete existing lookup
      lookupObj.push({ isDelete: true, obj: oldLookup });
    }
    if (conditionalLookup) {
      lookupObj.push({ isDelete: false, obj: conditionalLookup });
    }
    updateLookup(lookupObj);
  }, [updateLookup]);
  const handleSubmit = useCallback(
    formVal => {
      const oldLookupValue = lookupName && lookups.find(lookup => lookup.name === lookupName);
      const {
        settings,
        lookup: updatedLookup,
        errorMessage,
        conditionalLookup,
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
      handleLookupUpdate(oldLookupValue, updatedLookup, conditionalLookup);
      if (isCategoryMapping) {
        patchCategoryMappingSettings(settings);
      } else {
        patchMappingSettings(settings);
      }
    },
    [enquesnackbar, extract, generate, handleLookupUpdate, isCategoryMapping, lookupName, lookups, patchCategoryMappingSettings, patchMappingSettings]
  );

  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);

  return (
    <DynaForm
      disabled={disabled}
      fieldMeta={fieldMeta}
      optionsHandler={fieldMeta.optionsHandler}
      formState={formState}>
      <DynaSubmit
        disabled={disableSave}
        id="fieldMappingSettingsSave"
        showCustomFormValidations={showCustomFormValidations}
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
    </DynaForm>

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
      hideBackButton={false}
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
