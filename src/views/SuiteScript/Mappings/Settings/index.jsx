import React, { useState, useMemo, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, shallowEqual } from 'react-redux';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import netsuiteMetadata from './metadata/netsuite';
import salesforceMetadata from './metadata/salesforce';
import * as selectors from '../../../../reducers';
import settingsUtil from './util';

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


export default function MappingSettings(props) {
  const classes = useStyles();
  const {
    title,
    value,
    onClose,
    open,
    updateLookup,
    disabled,
    ssLinkedConnectionId,
    integrationId,
    flowId,
  } = props;
  const { lookups = []} = useSelector(state => selectors.suiteScriptMappings(state));
  const {importType, connectionId, recordType} = useSelector(state => {
    const flows = selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    });
    const selectedFlow = flows && flows.find(flow => flow._id === flowId);
    const {type, _connectionId, recordType } = (selectedFlow && selectedFlow.import) || {};
    return {importType: type, connectionId: _connectionId, recordType};
  }, shallowEqual);

  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const { generate, extract, index } = value;
  const [enquesnackbar] = useEnqueueSnackbar();

  const lookup = useMemo(() => {
    if (!value || !value.lookupName) return;
    return lookups.find(l => l.name === value.lookupName);
  }, [lookups, value]);
  const fieldMeta = useMemo(
    () => {
      if (importType === 'netsuite') {
        return netsuiteMetadata.getMetaData({
          value,
          extractFields: [],
          generate,
          generateFields: [],
          ssLinkedConnectionId,
          connectionId,
          lookup,
          recordType
        });
      }
      if (importType === 'salesforce') {
        return salesforceMetadata.getMetaData({
          value,
          extractFields: [],
          generate,
          generateFields: [],
          ssLinkedConnectionId,
          connectionId,
          lookup,
        });
      }
    }, [connectionId, generate, importType, lookup, recordType, ssLinkedConnectionId, value]
  );
  const handleSubmit = useCallback(
    formVal => {
      const {
        settings,
        lookup: updatedLookup,
        errorStatus,
        errorMessage,
      } = settingsUtil.getFormattedValue(
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
      updateLookup(lookupObj);

      onClose(true, settings);
    },
    [enquesnackbar, extract, generate, lookup, onClose, updateLookup]
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
      <DrawerTitleBar onClose={() => onClose(false)} title={title} />
      <div className={classes.content}>
        <DynaForm
          disabled={disabled}
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}
          formState={formState}>
          <DynaSubmit
            disabled={disabled}
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
        </DynaForm>
      </div>
    </Drawer>
  );
}
