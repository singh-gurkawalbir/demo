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
import { emptyObject } from '../../../utils/constants';

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
}) {
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {value, lookups} = useSelector(state => {
    const { mappings, lookups } = selectors.mapping(state);

    const value = mappings.find(({key}) => key === mappingKey) || emptyObject;

    return {value, lookups};
  }, shallowEqual);
  const generateFields = useSelector(state =>
    selectors.mappingGenerates(state, importId, subRecordMappingId)
  );
  const extractFields = useSelector(state =>
    selectors.mappingExtracts(state, importId, flowId, subRecordMappingId)
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

    dispatch(actions.mapping.updateLookup(lookupsTmp));
  }, [dispatch, lookups]);
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
      const lookupObj = [];

      if (updatedLookup) {
        const isDelete = false;

        lookupObj.push({ isDelete, obj: updatedLookup });
      } else if (oldLookupValue) {
        // When user tries to reconfigure setting and tries to remove lookup, delete existing lookup
        const isDelete = true;

        lookupObj.push({ isDelete, obj: oldLookupValue });
      }
      if (conditionalLookup) {
        lookupObj.push({ isDelete: false, obj: conditionalLookup });
      }
      updateLookup(lookupObj);
      dispatch(actions.mapping.patchSettings(mappingKey, settings));
      onClose();
    },
    [dispatch, enquesnackbar, extract, generate, lookupName, lookups, mappingKey, onClose, updateLookup]
  );

  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);

  return (
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
  );
}
