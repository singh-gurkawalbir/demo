import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import ResourceForm from '../../components/ResourceFormFactory';
import RadioGroup from '../../components/DynaForm/fields/DynaRadioGroup';
import DynaForm from '../../components/DynaForm';
import * as selectors from '../../reducers';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';

export default function AddOrSelect(props) {
  const { _connectionId, onSubmitComplete, connectionType, connection } = props;
  const [useNew, setUseNew] = useState(true);
  const connectionsList = useSelector(state =>
    selectors.matchingConnectionList(state, connection)
  );
  const options = connectionsList.map(c => ({ label: c.name, value: c._id }));
  const handleTypeChange = (id, value) => {
    setUseNew(value === 'new');
  };

  const fieldMeta = {
    fieldMap: {
      connection: {
        id: 'connection',
        name: 'connection',
        type: 'select',
        required: true,
        label: 'Connection:',
        options: [
          {
            items: options,
          },
        ],
      },
    },
    layout: {
      fields: ['connection'],
    },
  };
  const handleSubmit = formVal => {
    if (!formVal.connection) {
      return false;
    }
  };

  return (
    <Fragment>
      <RadioGroup
        {...props}
        id="selectType"
        name="something"
        label="What would you like to do?"
        showOptionsHorizontally
        defaultValue={useNew ? 'new' : 'existing'}
        fullWidth
        onFieldChange={handleTypeChange}
        options={[
          {
            items: [
              { label: 'Setup New Connection', value: 'new' },
              { label: 'Use Existing Connection', value: 'existing' },
            ],
          },
        ]}
      />
      {useNew && (
        <ResourceForm
          editMode={false}
          resourceType="connections"
          resourceId={_connectionId}
          onSubmitComplete={onSubmitComplete}
          connectionType={connectionType}
        />
      )}
      {!useNew && (
        <DynaForm
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      )}
    </Fragment>
  );
}
