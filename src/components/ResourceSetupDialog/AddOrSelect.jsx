import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceForm from '../../components/ResourceFormFactory';
import RadioGroup from '../../components/DynaForm/fields/DynaRadioGroup';
import DynaForm from '../../components/DynaForm';
import * as selectors from '../../reducers';
import LoadResources from '../LoadResources';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import {
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
} from '../../constants/resource';

export default function AddOrSelect(props) {
  const {
    resourceId,
    onSubmitComplete,
    connectionType,
    resource,
    environment,
    resourceType = 'connections',
  } = props;
  const [useNew, setUseNew] = useState(true);
  const resourceName = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];
  const resourceLabel =
    RESOURCE_TYPE_SINGULAR_TO_LABEL[
      RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]
    ];
  const resourceList = useSelector(state =>
    selectors.filteredResourceList(state, resource, resourceType, environment)
  );
  const options = resourceList.map(c => ({
    label: c.offline ? `${c.name} - Offline` : c.name,
    value: c._id,
    disabled: !!c.offline,
  }));
  const newId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, newId)
  );

  useEffect(() => {
    if (isAuthorized) onSubmitComplete(newId, isAuthorized);
  }, [isAuthorized, newId, onSubmitComplete]);

  const handleTypeChange = (id, value) => {
    setUseNew(value === 'new');
  };

  const handleSubmitComplete = () => {
    onSubmitComplete(newId, isAuthorized);
  };

  const fieldMeta = {
    fieldMap: {
      [resourceName]: {
        id: resourceName,
        name: resourceName,
        type: 'select',
        required: true,
        label: resourceLabel,
        options: [
          {
            items: options,
          },
        ],
      },
    },
    layout: {
      fields: [resourceName],
    },
  };
  const handleSubmit = formVal => {
    if (!formVal[resourceName]) {
      return false;
    }

    onSubmitComplete(formVal[resourceName], true);
  };

  return (
    <LoadResources resources={resourceType}>
      <RadioGroup
        {...props}
        id="selectType"
        label="What would you like to do?"
        defaultValue={useNew ? 'new' : 'existing'}
        fullWidth
        onFieldChange={handleTypeChange}
        options={[
          {
            items: [
              { label: `Setup New ${resourceLabel}`, value: 'new' },
              { label: `Use Existing ${resourceLabel}`, value: 'existing' },
            ],
          },
        ]}
      />
      {useNew ? (
        <ResourceForm
          editMode={false}
          resourceType={resourceType}
          resourceId={resourceId}
          onSubmitComplete={handleSubmitComplete}
          connectionType={connectionType}
        />
      ) : (
        <DynaForm
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <DynaSubmit onClick={handleSubmit}>Done</DynaSubmit>
        </DynaForm>
      )}
    </LoadResources>
  );
}
