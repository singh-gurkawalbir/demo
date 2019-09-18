import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  makeStyles,
} from '@material-ui/core';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import utilityFunctions from '../../../utils/utilityFunctions';
import RestMappingSettings from './definitions/rest';
import NetsuiteMappingSettings from './definitions/netsuite';
import LoadResources from '../../LoadResources';

const useStyles = makeStyles(() => ({
  modalContent: {
    width: '70vw',
  },
}));

export default function ImportMappingSettings(props) {
  const {
    title,
    value,
    onClose,
    extractFields,
    lookup,
    updateLookup,
    application,
  } = props;
  const classes = useStyles();
  let fieldMeta;

  switch (application) {
    case 'REST':
      fieldMeta = RestMappingSettings.getMetaData({
        value,
        lookup,
        extractFields,
      });
      break;
    case 'netsuite':
      fieldMeta = NetsuiteMappingSettings.getMetaData({
        value,
        lookup,
        extractFields,
      });
      break;
    default:
  }

  const handleSubmit = formVal => {
    const mappingSettingsTmp = {};

    mappingSettingsTmp.generate = value.generate;

    if (formVal.dataType === 'date') {
      mappingSettingsTmp.dataType = 'string';
      mappingSettingsTmp.exportDateTimeZone = formVal.exportDateTimeZone;
      mappingSettingsTmp.exportDateFormat = formVal.exportDateFormat;
      mappingSettingsTmp.importDateFormat = formVal.importDateFormat;
      mappingSettingsTmp.importDateTimeZone = formVal.importDateTimeZone;
    } else if (formVal.dataType) {
      mappingSettingsTmp.dataType = formVal.dataType;
    }

    if (formVal.discardIfEmpty) {
      mappingSettingsTmp.discardIfEmpty = formVal.discardIfEmpty;
    }

    if (formVal.useAsAnInitializeValue) {
      mappingSettingsTmp.useAsAnInitializeValue =
        formVal.useAsAnInitializeValue;
    }

    if (formVal.immutable) {
      mappingSettingsTmp.immutable = formVal.immutable;
    }

    if (formVal.restImportFieldMappingSettings === 'hardCoded') {
      // in case of hardcoded value, we dont save extract property
      switch (formVal.standardAction) {
        case 'useEmptyString':
          mappingSettingsTmp.hardCodedValue = '';
          break;
        case 'useNull':
          mappingSettingsTmp.hardCodedValue = null;
          break;
        case 'default':
          mappingSettingsTmp.hardCodedValue = formVal.default;
          break;
        default:
      }
    } else {
      if (formVal.restImportFieldMappingSettings === 'multifield') {
        mappingSettingsTmp.extract = formVal.expression;
      } else {
        mappingSettingsTmp.extract = value.extract;
      }

      switch (formVal.standardAction) {
        case 'useEmptyString':
          mappingSettingsTmp.default = '';
          break;
        case 'useNull':
          mappingSettingsTmp.default = null;
          break;
        case 'default':
          mappingSettingsTmp.default = formVal.default;
          break;
        default:
      }
    }

    if (formVal.restImportFieldMappingSettings === 'lookup') {
      const lookupTmp = {};

      if (lookup && lookup.name) {
        lookupTmp.name = lookup.name;
      } else {
        lookupTmp.name = utilityFunctions.getRandomName();
      }

      mappingSettingsTmp.lookupName = lookupTmp.name;

      if (formVal._mode === 'dynamic') {
        lookupTmp.method = formVal._method;
        lookupTmp.relativeURI = formVal._relativeURI;
        // lookup.allowFailures = false
        lookupTmp.extract = formVal._extract;
        lookupTmp.postBody = formVal._postBody;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          lookupTmp.map[obj.export] = obj.import;
        });
      }

      if (formVal.standardAction === 'disallowFailure')
        lookupTmp.allowFailures = false;
      else {
        lookupTmp.allowFailures = true;

        switch (formVal.standardAction) {
          case 'useEmptyString':
            lookupTmp.default = '';
            break;
          case 'useNull':
            lookupTmp.default = null;
            break;
          case 'default':
            lookupTmp.default = formVal.default;
            break;
          default:
        }
      }

      updateLookup(false, lookupTmp);
    } else if (lookup) {
      // delete the lookup . case where lookup was present before but its not a part of mapping anymore
      updateLookup(true, lookup);
    }

    onClose(true, mappingSettingsTmp);
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <LoadResources resources="imports, connections" required>
          <DynaForm
            fieldMeta={fieldMeta}
            optionsHandler={fieldMeta.optionsHandler}>
            <Button
              onClick={() => {
                onClose(false);
              }}>
              Cancel
            </Button>
            <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
          </DynaForm>
        </LoadResources>
      </DialogContent>
    </Dialog>
  );
}
