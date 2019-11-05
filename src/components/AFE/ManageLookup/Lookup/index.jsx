import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '60vw',
  },
}));

export default function Lookup(props) {
  const {
    onSave,
    lookup = {},
    onCancel,
    error,
    showDynamicLookupOnly = false,
  } = props;
  const classes = useStyles();
  const isEdit = !!(lookup && lookup.name);
  const handleSubmit = formVal => {
    const lookupObj = {};

    if (formVal.mode === 'static') {
      lookupObj.map = {};
      formVal.mapList.forEach(obj => {
        lookupObj.map[obj.export] = obj.import;
      });
    } else {
      lookupObj.method = formVal.method;
      lookupObj.relativeURI = formVal.relativeURI;
      lookupObj.body = formVal.body;
      lookupObj.extract = formVal.extract;
    }

    switch (formVal.failRecord) {
      case 'disallowFailure':
        lookupObj.allowFailures = false;
        delete lookupObj.default;
        break;
      case 'useEmptyString':
        lookupObj.allowFailures = true;
        lookupObj.default = '';
        break;
      case 'useNull':
        lookupObj.allowFailures = true;
        lookupObj.default = null;
        break;
      case 'default':
        lookupObj.allowFailures = true;
        lookupObj.default = formVal.default;
        break;
      default:
    }

    lookupObj.name = formVal.name;
    onSave(isEdit, lookupObj);
  };

  const getFailedRecordDefault = () => {
    if (!isEdit || !lookup || !lookup.allowFailures) {
      return 'disallowFailure';
    }

    switch (lookup.default) {
      case '':
        return 'useEmptyString';
      case null:
        return 'useNull';
      default:
        return 'default';
    }
  };

  const fieldMeta = {
    fieldMap: {
      mode: {
        id: 'mode',
        name: 'mode',
        type: 'radiogroup',
        label: '',
        defaultValue: isEdit && lookup && lookup.map ? 'static' : 'dynamic',
        options: [
          {
            items: [
              { label: 'Dynamic Search', value: 'dynamic' },
              { label: 'Static: Value to Value', value: 'static' },
            ],
          },
        ],
      },
      relativeURI: {
        id: 'relativeURI',
        name: 'relativeURI',
        type: 'text',
        label: 'Relative URI',
        placeholder: 'Relative URI',
        defaultValue: lookup.relativeURI,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      method: {
        id: 'method',
        name: 'method',
        type: 'select',
        label: 'HTTP Method',
        defaultValue: lookup.method,
        options: [
          {
            heading: 'Select Http Method',
            items: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
            ],
          },
        ],
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      body: {
        id: 'body',
        name: 'body',
        type: 'httprequestbody',
        label: 'Build HTTP Request Body',
        defaultValue: lookup.body,
        visibleWhenAll: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
          {
            field: 'method',
            is: ['POST'],
          },
        ],
      },
      extract: {
        id: 'extract',
        name: 'extract',
        type: 'text',
        label: 'Resource Identifier Path',
        placeholder: 'Resource Identifier Path',
        defaultValue: lookup.extract,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },

      mapList: {
        id: 'mapList',
        name: 'mapList',
        type: 'staticMap',
        label: '',
        keyName: 'export',
        keyLabel: 'Export Field',
        valueName: 'import',
        valueLabel: 'Import Field (HTTP)',
        map: isEdit && lookup && lookup.map,
        visibleWhen: [
          {
            field: 'mode',
            is: ['static'],
          },
        ],
      },
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: lookup.name,
        placeholder: 'Alphanumeric characters only please',
      },
      failRecord: {
        id: 'failRecord',
        name: 'failRecord',
        type: 'radiogroup',
        label: 'Action to take if unique match not found',
        defaultValue: getFailedRecordDefault() || 'disallowFailure',
        options: [
          {
            items: [
              {
                label: 'Fail Record',
                value: 'disallowFailure',
              },
              {
                label: 'Use Empty String as Default Value',
                value: 'useEmptyString',
              },
              {
                label: 'Use Null as Default Value',
                value: 'useNull',
              },
              {
                label: 'Use Custom Default Value',
                value: 'default',
              },
            ],
          },
        ],
      },
      default: {
        id: 'default',
        name: 'default',
        type: 'text',
        label: 'Enter Default Value',
        defaultValue: lookup.default,
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            field: 'failRecord',
            is: ['default'],
          },
        ],
      },
    },
    layout: {
      fields: [
        'mode',
        'relativeURI',
        'method',
        'body',
        'extract',
        'mapList',
        'name',
        'failRecord',
        'default',
      ],
    },
  };

  if (showDynamicLookupOnly) {
    delete fieldMeta.fieldMap.mode;
    delete fieldMeta.fieldMap.mapList;
    fieldMeta.layout.fields = fieldMeta.layout.fields.filter(
      el => el !== 'mode' && el !== 'mapList'
    );
    const { relativeURI, method, body, extract } = fieldMeta.fieldMap;

    delete relativeURI.visibleWhen;
    delete method.visibleWhen;
    delete body.visibleWhenAll;
    delete extract.visibleWhen;

    fieldMeta.fieldMap.body.visibleWhen = [
      {
        field: 'method',
        is: ['POST'],
      },
    ];
  }

  return (
    <div className={classes.container}>
      <DynaForm fieldMeta={fieldMeta}>
        {error && (
          <div>
            <Typography
              color="error"
              variant="h5"
              className={classes.errorContainer}>
              {error}
            </Typography>
          </div>
        )}
        <Button data-test="cancelLookupForm" onClick={onCancel}>
          Cancel
        </Button>
        <DynaSubmit data-test="saveLookupForm" onClick={handleSubmit}>
          Save
        </DynaSubmit>
      </DynaForm>
    </div>
  );
}
