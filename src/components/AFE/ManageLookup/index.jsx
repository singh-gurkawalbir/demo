import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
// import stringUtil from '../../../utils/string';
import FormDialog from '../../FormDialog';
import HttpDynamicImport from './HttpDynamicImport';
import HttpStaticImport from './HttpStaticImport';
import DynaForm from '../../DynaForm';

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
}));

function optionsHandler() {
  return ['something1', 'something2'];
}

export default function ManageLookup() {
  // props
  // const { importId = '5d106e39e6150a7c62ce5188' } = props;
  const classes = useStyles();
  const [mode, setMode] = useState('dynamic');
  const fieldMeta = {
    fields: [
      {
        id: 'failFields',
        name: 'failFields',
        type: 'select',
        label: 'Action to take if unique match not found:',
        defaultValue: '',
        options: [
          {
            heading: 'Select Http Method:',
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
        placeholder: 'Enter Default Value',
        visibleWhen: [
          {
            id: 'default',
            field: 'failFields',
            is: ['defaultLookup'],
          },
        ],
      },
    ],
  };
  const handleSubmit = data => {
    // eslint-disable-next-line
    console.log(data);
  };

  const onClose = () => {
    // eslint-disable-next-line
    console.log("http import form closed");
  };

  const handleModeChange = val => {
    setMode(val);
  };

  const changeData = val => {
    // eslint-disable-next-line
    console.log(val);
  };

  const onFieldChange = val => {
    // eslint-disable-next-line
    console.log(val);
  };

  return (
    <FormDialog submitLabel="Save" onClose={onClose} onSubmit={handleSubmit}>
      <div>
        <RadioGroup
          aria-label="position"
          name="position"
          value={mode}
          onChange={e => handleModeChange(e.target.value)}
          row>
          <FormControlLabel
            value="dynamic"
            control={<Radio color="primary" />}
            label="Dynamic Search"
            labelPlacement="end"
          />
          <FormControlLabel
            value="static"
            control={<Radio color="primary" />}
            label="Static: Value to Value"
            labelPlacement="start"
          />
        </RadioGroup>
        <FormControl className={classes.formControl}>
          {mode === 'dynamic' ? (
            <HttpDynamicImport onFieldChange={onFieldChange} />
          ) : (
            <HttpStaticImport />
          )}
          <DynaForm
            fieldMeta={fieldMeta}
            optionsHandler={optionsHandler}
            onChange={changeData}
          />
        </FormControl>
      </div>
    </FormDialog>
  );
}
