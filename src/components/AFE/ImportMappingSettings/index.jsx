import React, { useState, useMemo, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../drawer/TitleBar';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    overflow: 'auto',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > div:first-child': {
      height: `calc(100vh - 180px)`,
    },
  },
}));

/**
 *
 * disabled property set to true in case of monitor level access
 */

export default function ImportMappingSettings(props) {
  const classes = useStyles();
  const {
    title,
    value,
    onClose,
    open,
    extractFields,
    generateFields,
    updateLookup,
    application,
    options,
    disabled,
    lookups,
    isCategoryMapping,
  } = props;
  const [formState, setFormState] = useState({
    showValidationBeforeTouched: false,
  });
  const { generate, extract, index } = value;
  const [enquesnackbar] = useEnqueueSnackbar();
  const getLookup = name => lookups.find(lookup => lookup.name === name);
  const lookup = value && value.lookupName && getLookup(value.lookupName);
  const fieldMeta = useMemo(
    () =>
      ApplicationMappingSettings.getMetaData({
        application,
        value,
        extractFields,
        generate,
        generateFields,
        options,
        lookups,
        isCategoryMapping,
      }),
    [
      application,
      value,
      extractFields,
      generate,
      generateFields,
      options,
      lookups,
      isCategoryMapping,
    ]
  );
  const disableSave = useMemo(() => {
    // Disable all fields except useAsAnInitializeValue in case mapping is not editable
    const { fieldMap } = fieldMeta || {};
    const { isNotEditable } = value;

    return disabled || (isNotEditable && !fieldMap.useAsAnInitializeValue);
  }, [disabled, fieldMeta, value]);
  const handleSubmit = useCallback(
    formVal => {
      const {
        settings,
        lookup: updatedLookup,
        errorStatus,
        errorMessage,
        conditionalLookup,
      } = ApplicationMappingSettings.getFormattedValue(
        { generate, extract, lookup },
        formVal
      );
      const lookupObj = [];

      if (errorStatus) {
        enquesnackbar({
          message: errorMessage,
          variant: 'error',
        });

        return;
      }

      // Update lookup
      if (updatedLookup) {
        const isDelete = false;

        lookupObj.push({ isDelete, obj: updatedLookup });
      } else if (lookup) {
        // When user tries to reconfigure setting and tries to remove lookup, delete existing lookup
        const isDelete = true;

        lookupObj.push({ isDelete, obj: lookup });
      }

      if (conditionalLookup) {
        lookupObj.push({ isDelete: false, obj: conditionalLookup });
      }

      updateLookup(lookupObj);

      onClose(true, settings);
    },
    [enquesnackbar, extract, generate, lookup, onClose, updateLookup]
  );
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showValidationBeforeTouched: true,
    });
  }, []);
  const formKey = useFormInitWithPermissions({
    disabled,
    fieldsMeta: fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
    showValidationBeforeTouched: formState.showValidationBeforeTouched,
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar onClose={() => onClose(false)} title={title} />
      <div className={classes.content}>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <DynaSubmit
          formKey={formKey}
          disabled={disableSave}
          id="fieldMappingSettingsSave"
          showCustomFormValidations={showCustomFormValidations}
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <Button
          data-test={`fieldMappingSettingsCancel-${index}`}
          onClick={() => {
            onClose(false);
          }}
          variant="text"
          color="primary">
          Cancel
        </Button>
      </div>
    </Drawer>
  );
}
