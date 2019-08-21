import DynaForm from '../../DynaForm';

function optionsHandler() {
  return ['something1', 'something2'];
}

export default function HttpDynamicImport(props) {
  const { onFieldChange } = props;
  const fieldMeta = {
    fields: [
      {
        id: 'relativeURI',
        name: 'relativeURI',
        type: 'text',
        label: 'Relative URI:',
        placeholder: 'Relative URI',
      },
      {
        id: 'method',
        name: 'method',
        type: 'select',
        label: 'HTTP Method:',
        placeholder: 'Required',
        defaultValue: '',
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
      },
      {
        id: 'extract',
        name: 'extract',
        type: 'text',
        label: 'Resource Identifier Path:',
        placeholder: 'Resource Identifier Path',
      },
    ],
  };

  return (
    <DynaForm
      fieldMeta={fieldMeta}
      resourceId="DynaForm101"
      optionsHandler={optionsHandler}
      onChange={onFieldChange}
      // onChange={(a, b, c, d) => console.log(a, b, c, d)}
    />
  );
}
