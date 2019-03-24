import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Help from '../../components/Help';
import DynaForm from '../../components/DynaForm';
import { createAppropriatePathAndOptions } from '../../sagas/api';

function optionsHandler(options) {
  console.log('ran get options');

  console.log(`check ${JSON.stringify(options)}`);

  // const { fields } = options;

  // if (!fields) return [];
  // const recordType = fields.find(f => f.id === 'type').value;

  // if (recordType === '') return [];
  // const allData = [
  //   {
  //     items: [`${recordType}.id`, `${recordType}.name`, `${recordType}.date`],
  //   },
  // ];

  return ['something1', 'something2'];
}

export const getOptions = async (fieldId, fields) => {
  const path = '/processors/javascript';
  const opts = {
    method: 'POST',
    body: {
      data: fields,
      rules: {
        code: optionsHandler.toString(),
        function: 'optionsHandler',
      },
    },
  };
  const { options, req } = createAppropriatePathAndOptions(path, opts);

  options.body = JSON.stringify(options.body);

  return fetch(req, options)
    .then(response => {
      if (response.status >= 400 && response.status < 600)
        throw new Error('Error in fetching our opts');

      return response.json();
    })
    .then(resp => resp.data);
};

@hot(module)
@withStyles(theme => ({
  paper: {
    margin: theme.spacing.double,
    padding: theme.spacing.double,
  },
}))
export default class CustomForms extends Component {
  render() {
    const fieldMeta = {
      fields: [
        {
          id: 'relativeUri',
          name: '/http/relativeURI',
          defaultValue: 'override me!',
          type: 'relativeUri',
          label: 'Relative URI',
          visible: true,
          required: true,
          validWhen: {
            lengthIsGreaterThan: {
              length: 3,
              message: 'The value must have more than 3 characterrs',
            },
            lengthIsLessThan: {
              length: 6,
              message: 'The value must less than 6 characters',
            },
            fallsWithinNumericalRange: {
              min: 150,
              max: 80000,
              message: 'The value must be more than 150 and less than 80000',
            },
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Only numbers allowed',
            },
            isNot: {
              values: ['2500', '4001'],
              message: 'The value cannot be 2500 nor 4001',
            },
          },
        },
        {
          id: 'conn',
          name: 'conn',
          type: 'select',
          label: 'Connection',
          description: 'First choose a connection before continuing',
          placeholder: 'Required',
          defaultValue: '',
          options: [
            {
              heading: 'Connections',
              items: [
                {
                  label: 'NetSuite',
                  value: 'ns',
                },
                {
                  label: 'REST',
                  value: 'rest',
                },
              ],
            },
          ],
        },
        {
          id: 'type',
          name: 'type',
          type: 'select',
          label: 'Record Type',
          description: '',
          placeholder: '',
          defaultValue: '',
          options: [
            {
              items: ['Contact', 'Order'],
            },
          ],
          visible: false,
          omitWhenHidden: true,
          visibleWhen: [
            {
              id: 'isNetsuite',
              field: 'conn',
              is: ['ns'],
            },
          ],
        },
        {
          id: 'fields',
          name: 'fields',
          type: 'text',
          label: 'Fields',
          description: 'Choose which fields to include in your export record.',
          placeholder: '',
          defaultValue: [],
          refreshOptionsOnChangesTo: 'type',
          visible: false,
          visibleWhen: [
            {
              id: 'hasType',
              field: 'type',
              isNot: [''],
            },
          ],
        },

        // REST
        {
          id: 'method',
          name: 'method',
          type: 'select',
          label: 'HTTP Method',
          description: 'What HTTP Verb should be used to make your request?',
          placeholder: '',
          defaultValue: 'GET',
          options: [
            {
              items: ['GET', 'POST', 'PUT', 'DELETE'],
            },
          ],
          visible: false,
          omitWhenHidden: true,
          visibleWhen: [
            {
              id: 'isREST',
              field: 'conn',
              is: ['rest'],
            },
          ],
        },
        {
          id: 'body',
          name: 'body',
          type: 'textarea',
          label: 'HTTP Request Body',
          description: 'POST and PUT requests can have a body. ',
          placeholder: 'optional',
          multiline: true,
          rows: 4,
          maxRows: 6,
          defaultValue: '',
          visible: false,
          omitWhenHidden: true,
          visibleWhen: [
            {
              id: 'allowsBody',
              field: 'method',
              is: ['POST', 'PUT'],
            },
          ],
        },
      ],
    };
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Typography variant="h4">Custom Forms Placeholder</Typography>

        <Help helpKey="connection.type" />

        <DynaForm
          fieldMeta={fieldMeta}
          optionsHandler={optionsHandler}
          // onChange={(a, b, c, d) => console.log(a, b, c, d)}
        />
        <Help helpKey="connection.type" />
      </Paper>
    );
  }
}
