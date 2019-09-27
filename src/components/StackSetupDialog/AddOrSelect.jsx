import { useState } from 'react';
import { useSelector } from 'react-redux';
import ResourceForm from '../../components/ResourceFormFactory';
import RadioGroup from '../../components/DynaForm/fields/DynaRadioGroup';
import DynaForm from '../../components/DynaForm';
import * as selectors from '../../reducers';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import LoadResources from '../LoadResources';

export default function AddOrSelect(props) {
  const { resourceId, onSubmitComplete } = props;
  const [useNew, setUseNew] = useState(true);
  const stacksList = useSelector(state => selectors.matchingStackList(state));
  const options = stacksList.map(c => ({ label: c.name, value: c._id }));
  const newId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );
  const handleTypeChange = (id, value) => {
    setUseNew(value === 'new');
  };

  const handleSubmitComplete = () => {
    onSubmitComplete(newId);
  };

  const fieldMeta = {
    fieldMap: {
      stack: {
        id: 'stack',
        name: 'stack',
        type: 'select',
        required: true,
        label: 'Stack:',
        options: [
          {
            items: options,
          },
        ],
      },
    },
    layout: {
      fields: ['stack'],
    },
  };
  const handleSubmit = formVal => {
    if (!formVal.stack) {
      return false;
    }

    onSubmitComplete(formVal.stack);
  };

  return (
    <LoadResources resources="stacks">
      <RadioGroup
        {...props}
        id="selectType"
        name="stack"
        label="What would you like to do?"
        showOptionsHorizontally
        defaultValue={useNew ? 'new' : 'existing'}
        fullWidth
        onFieldChange={handleTypeChange}
        options={[
          {
            items: [
              { label: 'Setup New Stack', value: 'new' },
              { label: 'Use Existing Stack', value: 'existing' },
            ],
          },
        ]}
      />
      {useNew && (
        <ResourceForm
          editMode={false}
          resourceType="stacks"
          resourceId={resourceId}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
      {!useNew && (
        <DynaForm fieldMeta={fieldMeta}>
          <DynaSubmit onClick={handleSubmit}>Done</DynaSubmit>
        </DynaForm>
      )}
    </LoadResources>
  );
}
