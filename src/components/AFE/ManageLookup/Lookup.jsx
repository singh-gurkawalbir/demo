import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '500px',
  },
}));

export default function Lookup(props) {
  const { onSave, lookup, onCancelClick } = props;
  const classes = useStyles();
  const isEdit = !!(lookup && lookup.name);
  // Lookup is a map. Converting map to list
  // TODO: After DynaStaticMap changes to handle map directly in progress. Change to use map directly later
  let lookupList = [];

  if (isEdit && lookup && lookup.map) {
    lookupList = _.map(lookup.map, (val, key) => ({
      export: key,
      import: val,
    }));
  }

  const save = formVal => {
    const lookupObj = { ...formVal };

    if (lookupObj.mode === 'static') {
      lookupObj.map = {};
      lookupObj.mapList.forEach(obj => {
        lookupObj.map[obj.export] = obj.import;
      });
      delete lookupObj.method;
      delete lookupObj.relativeURI;
      delete lookupObj.body;
      delete lookupObj.extract;
    } else {
      delete lookupObj.mapList;
      delete lookupObj.map;
    }

    switch (lookupObj.failRecord) {
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
        break;
      default:
    }

    delete lookupObj.failRecord;
    delete lookupObj.mode;
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
    fields: [
      {
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
      {
        id: 'relativeURI',
        name: 'relativeURI',
        type: 'text',
        label: 'Relative URI:',
        placeholder: 'Relative URI',
        defaultValue: lookup.relativeURI || undefined,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      {
        id: 'method',
        name: 'method',
        type: 'select',
        label: 'HTTP Method:',
        placeholder: 'Required',
        defaultValue: lookup.method || undefined,
        options: [
          {
            heading: 'Select Http Method:',
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
      {
        id: 'body',
        name: 'body',
        type: 'httprequestbody',
        label: 'Build HTTP Request Body',
        defaultValue: lookup.body || undefined,
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
      {
        id: 'extract',
        name: 'extract',
        type: 'text',
        label: 'Resource Identifier Path:',
        placeholder: 'Resource Identifier Path',
        defaultValue: lookup.extract || undefined,
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },

      {
        id: 'mapList',
        name: 'mapList',
        type: 'staticMap',
        label: '',
        optionsMap: [
          {
            id: 'export',
            label: 'Export Field',
            required: true,
            type: 'input',
            supportsRefresh: false,
          },
          {
            id: 'import',
            label: 'Import Field (HTTP)',
            required: true,
            type: 'input',
            supportsRefresh: false,
          },
        ],
        value: lookupList || [],
        visibleWhen: [
          {
            field: 'mode',
            is: ['static'],
          },
        ],
      },
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name:',
        defaultValue: lookup.name || undefined,
        placeholder: 'Alphanumeric characters only please',
      },
      {
        id: 'failRecord',
        name: 'failRecord',
        type: 'radiogroup',
        label: 'Action to take if unique match not found:',
        defaultValue: getFailedRecordDefault(),
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
      {
        id: 'default',
        name: 'default',
        type: 'text',
        label: 'Enter Default Value:',
        defaultValue: lookup.default || undefined,
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            field: 'failRecord',
            is: ['default'],
          },
        ],
      },
    ],
  };

  return (
    <div className={classes.container}>
      <DynaForm fieldMeta={fieldMeta}>
        <Button onClick={onCancelClick}>Cancel</Button>
        <DynaSubmit onClick={save}>Save</DynaSubmit>
      </DynaForm>
    </div>
  );
}
