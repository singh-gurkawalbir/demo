import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RadioGroup from '../DynaForm/fields/radiogroup/DynaRadioGroup';
import ResourceFormWithStatusPanel from '../ResourceFormWithStatusPanel';
import DynaForm from '../DynaForm';
import { selectors } from '../../reducers';
import LoadResources from '../LoadResources';
import DynaSubmit from '../DynaForm/DynaSubmit';
import {
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
} from '../../constants/resource';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import ResourceFormActionsPanel from '../drawer/Resource/Panel/ResourceFormActionsPanel';
import { generateNewId } from '../../utils/resource';

const useStyles = makeStyles(theme => ({
  resourceFormWrapper: {
    padding: theme.spacing(3),
    overflowY: 'auto',
  },
  resourceFormRadioGroupWrapper: {
    marginBottom: theme.spacing(2),
  },
}));

export default function AddOrSelect(props) {
  const {
    resourceId,
    onSubmitComplete,
    connectionType,
    resource,
    environment,
    resourceType = 'connections',
    manageOnly = false,
    onClose,
  } = props;
  const classes = useStyles();
  const [newFormId] = useState(generateNewId());
  const [useNew, setUseNew] = useState(true);
  const resourceName = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];
  const resourceLabel =
    RESOURCE_TYPE_SINGULAR_TO_LABEL[
      RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]
    ];
  const resourceList = useSelector(state =>
    selectors.filteredResourceList(state, resource, resourceType, environment, manageOnly)
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

  const handleSubmitComplete = (connId, isAuthorized, connectionDoc = {}) => {
    onSubmitComplete(newId, isAuthorized, connectionDoc);
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

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <LoadResources resources={resourceType}>
      <div className={classes.resourceFormWrapper}>
        <RadioGroup
          value={props.value}
          id="selectType"
          className={classes.resourceFormRadioGroupWrapper}
          label="What would you like to do?"
          defaultValue={useNew ? 'new' : 'existing'}
          isValid
          onFieldChange={handleTypeChange}
          options={[
            {
              items: [
                { label: `Set up new ${resourceName}`, value: 'new' },
                { label: `Use existing ${resourceName}`, value: 'existing' },
              ],
            },
          ]}
        />
        {/* div wrapping is imp. since child component is reusable component and it inherits parent top parent. Validate before removing */}
        <div>
          {useNew ? (

            <ResourceFormWithStatusPanel
              formKey={newFormId}
              heightOffset="250"
              occupyFullWidth
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={handleSubmitComplete}
            />

          ) : (

            <DynaForm formKey={formKey} fieldMeta={fieldMeta} />

          )}
        </div>
      </div>

      {useNew ? (
        <ResourceFormActionsPanel
          formKey={newFormId}
          resourceType={resourceType}
          resourceId={resourceId}
          submitButtonLabel="Save & close"
          cancelButtonLabel="Cancel"
          onSubmitComplete={handleSubmitComplete}
          connectionType={connectionType}
          onCancel={onClose} />
      ) : (
        <DynaSubmit formKey={formKey} onClick={handleSubmit}>
          Done
        </DynaSubmit>
      )}
    </LoadResources>
  );
}
