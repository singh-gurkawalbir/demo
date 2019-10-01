import { Fragment, useState, useEffect } from 'react';
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
  const newId = useSelector(state =>
    selectors.createdResourceId(state, _connectionId)
  );
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, newId)
  );

  useEffect(() => {
    onSubmitComplete(newId, isAuthorized);
  }, [isAuthorized, newId, onSubmitComplete]);

  const handleTypeChange = (id, value) => {
    setUseNew(value === 'new');
  };

  const handleSubmitComplete = () => {
    onSubmitComplete(newId, isAuthorized);
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

    onSubmitComplete(formVal.connection);
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
          onSubmitComplete={handleSubmitComplete}
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
