import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import { FormContext } from 'react-forms-processor/dist';
import DynaForm from '../../DynaForm';

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: '500px',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
  },
  label: {
    fontSize: '12px',
  },
}));

function optionsHandler() {
  return ['something1', 'something2'];
}

const SubmitButton = props => (
  <FormContext.Consumer>
    {form => (
      <Button
        onClick={() => {
          props.onSubmit(form.value);
        }}>
        Save
      </Button>
    )}
  </FormContext.Consumer>
);

export default function Lookup(props) {
  const { onSave, lookupObj, onCancelClick } = props;
  const isEdit = !!(lookupObj && lookupObj.name);
  let mapListDefualtValues = [];

  if (isEdit && lookupObj && lookupObj.map) {
    mapListDefualtValues = _.map(lookupObj.map, (val, key) => ({
      export: key,
      import: val,
    }));
  }

  const save = formVal => {
    const lookup = formVal;

    if (lookup.mode === 'static') {
      lookup.map = {};
      lookup.mapList.splice(-1, 1);

      lookup.mapList.forEach(obj => {
        lookup.map[obj.export] = obj.import;
      });
      delete lookup.method;
      delete lookup.relativeURI;
      delete lookup.body;
      delete lookup.extract;
    } else {
      delete lookup.mapList;
      delete lookup.map;
    }

    switch (lookup.failRecord) {
      case 'disallowFailure':
        lookup.allowFailures = false;
        delete lookup.default;
        break;
      case 'useEmptyString':
        lookup.allowFailures = true;
        lookup.default = '';
        break;
      case 'useNull':
        lookup.allowFailures = true;
        lookup.default = null;
        break;
      case 'default':
        lookup.allowFailures = true;
        break;
      default:
    }

    delete lookup.failRecord;
    delete lookup.mode;
    onSave(isEdit, lookup);
  };

  const getFailRecordDefault = () => {
    if (!isEdit || !lookupObj.allowFailures) {
      return 'disallowFailure';
    }

    switch (lookupObj.default) {
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
        defaultValue:
          isEdit && lookupObj && lookupObj.map ? 'static' : 'dynamic',
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
        defaultValue: lookupObj.relativeURI || undefined,
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
        defaultValue: lookupObj.method || undefined,
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
        defaultValue: lookupObj.body || undefined,
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
        defaultValue: lookupObj.extract || undefined,
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
        value: mapListDefualtValues || [],
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
        defaultValue: lookupObj.name || undefined,
        placeholder: 'Alphanumeric characters only please',
      },
      {
        id: 'failRecord',
        name: 'failRecord',
        type: 'radiogroup',
        label: 'Action to take if unique match not found:',
        defaultValue: getFailRecordDefault(),
        options: [
          {
            heading: '',
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
        defaultValue: lookupObj.default || undefined,
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
  const classes = useStyles();
  // const [lookup, setLookupData] = useState([]);

  // const { importId = '5d106e39e6150a7c62ce5188' } = props;
  // console.log(lookup);

  return (
    <div className={classes.container}>
      <DynaForm
        fieldMeta={fieldMeta}
        optionsHandler={optionsHandler}
        // onChange={changeData}
      >
        <Button onClick={onCancelClick} className={classes.actionButton}>
          Cancel
        </Button>
        {<SubmitButton onSubmit={save} />}
      </DynaForm>
    </div>
  );
}
