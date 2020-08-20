import React, { useState, useMemo, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import {selectors} from '../../../reducers';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../drawer/TitleBar';

const emptySet = {};
const emptyObject = {};
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    overflow: 'auto',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > div:first-child': {
      height: 'calc(100vh - 180px)',
    },
  },
}));

/**
 *
 * disabled property set to true in case of monitor level access
 */

export default function MappingSettings({
  onClose,
  mappingKey,
  open,
  disabled,
  importId,
  flowId,
  subRecordMappingId,
  isCategoryMapping,
  ...categoryMappingOpts
}) {
  const { sectionId, editorId, integrationId, mappingIndex} = categoryMappingOpts;
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {value, lookups} = useSelector(state => {
    if (isCategoryMapping) {
      const {mappings, lookups} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);

      return {value: mappings[mappingIndex], lookups};
    }
    const { mappings, lookups } = selectors.mapping(state);
    const value = mappings.find(({key}) => key === mappingKey) || emptyObject;

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
  }

  );
  const extractFields = useSelector(state => {
    if (isCategoryMapping) {
      return selectors.categoryMappingMetadata(state, integrationId, flowId).extractsMetadata;
    }

    return selectors.mappingExtracts(state, importId, flowId, subRecordMappingId);
  }

  );
  const nsRecordType = useSelector(state =>
    selectors.mappingNSRecordType(state, importId, subRecordMappingId)
  );
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
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
  }, [dispatch, editorId, flowId, integrationId, mappingIndex]);
  const patchMappingSettings = useCallback(settings => {
    dispatch(actions.mapping.patchSettings(mappingKey, settings));
  }, [dispatch, mappingKey]);
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
      onClose();
    },
    [enquesnackbar, extract, generate, handleLookupUpdate, isCategoryMapping, lookupName, lookups, onClose, patchCategoryMappingSettings, patchMappingSettings]
  );

  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <DrawerTitleBar onClose={onClose} title="Settings" />
        <div className={classes.content}>
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
              onClick={onClose}
              variant="text"
              color="primary">
              Cancel
            </Button>
          </DynaForm>
        </div>
      </Drawer>
    </>
  );
}
