import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { FormContext } from 'react-forms-processor/dist';
import DynaForm from '../../DynaForm';

function optionsHandler() {
  return ['something1', 'something2'];
}

export default function NewLookup(props) {
  const { onSubmit, lookupObj, onCancelClick } = props;
  const useStyles = makeStyles(theme => ({
    container: {
      // border: 'solid 1px',
      // borderColor: theme.palette.text.disabled,
      // backgroundColor: theme.palette.background.default,
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
  const fieldMeta = {
    fields: [
      {
        id: 'mode',
        name: 'mode',
        type: 'radiogroup',
        label: '',
        defaultValue: 'dynamic',
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
        defaultValue: lookupObj.relativeURI || '',
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
        defaultValue: lookupObj.method || '',
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
        id: 'extract',
        name: 'extract',
        type: 'text',
        label: 'Resource Identifier Path:',
        placeholder: 'Resource Identifier Path',
        defaultValue: lookupObj.extract || '',
        visibleWhen: [
          {
            field: 'mode',
            is: ['dynamic'],
          },
        ],
      },
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name:',
        defaultValue: lookupObj.name || '',
        placeholder: 'Alphanumeric characters only please',
      },
      {
        id: 'failFields',
        name: 'failFields',
        type: 'radiogroup',
        label: 'Action to take if unique match not found:',
        defaultValue: lookupObj.failFields || 'allowFailures',
        options: [
          {
            heading: '',
            items: [
              {
                label: 'Fail Record',
                value: 'allowFailures',
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
                value: 'defaultLookup',
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
        defaultValue: lookupObj.default || '',
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            field: 'failFields',
            is: ['defaultLookup'],
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
        {
          <SubmitButton
            onSubmit={onSubmit}
            // setFieldValue={setLookupData}
          />
        }
      </DynaForm>
    </div>
  );
}
