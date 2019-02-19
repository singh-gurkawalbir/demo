import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Options } from 'integrator-ui-forms/packages/core/dist';
import { withStyles } from '@material-ui/core/styles';
import Help from '../../components/Help';
import DynaForm from '../../components/DynaForm';
import { createAppropriatePathAndOptions } from '../../sagas/api';

function optionsHandler(options) {
  const fields = options;
  const recordType = fields.find(f => f.id === 'type').value;

  if (recordType === '') return [];
  const allData = [
    {
      items: [`${recordType}.id`, `${recordType}.name`, `${recordType}.date`],
    },
  ];

  return allData;
}

export const getOptions: () => Promise<Options> = (fieldId, fields) => {
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
    .then(response => response.json())
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
    const fields = [
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
        type: 'multiselect',
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
    ];
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Typography variant="h4">Custom Forms Placeholder</Typography>

        <Help helpKey="connection.type" />

        <DynaForm
          defaultFields={fields}
          optionsHandler={getOptions}
          // onChange={(a, b, c, d) => console.log(a, b, c, d)}
        />
      </Paper>
    );
  }
}
