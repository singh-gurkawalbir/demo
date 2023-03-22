import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import RadioGroup from '../DynaForm/fields/radiogroup/DynaRadioGroup';
import ResourceFormWithStatusPanel from '../ResourceFormWithStatusPanel';
import DynaForm from '../DynaForm';
import { selectors } from '../../reducers';
import LoadResources from '../LoadResources';
import {
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
} from '../../constants/resource';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import ResourceFormActionsPanel from '../drawer/Resource/Panel/ResourceFormActionsPanel';
import SaveAndCloseMiniResourceForm from '../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import DrawerContent from '../drawer/Right/DrawerContent';

const useStyles = makeStyles(theme => ({
  resourceFormWrapper: {
    padding: theme.spacing(3),
    overflowY: 'auto',
  },
  resourceFormRadioGroupWrapper: {
    marginBottom: theme.spacing(2),
  },
  doneBtn: {
    margin: theme.spacing(0, 3),
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
    formKey,
  } = props;
  const classes = useStyles();
  const [useNew, setUseNew] = useState(true);
  const [remountCount, setRemountCount] = useState(0);
  const resourceName = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];
  const resourceLabel =
    RESOURCE_TYPE_SINGULAR_TO_LABEL[
      RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]
    ];
  const resourceList = useSelector(state =>
    selectors.filteredResourceList(state, resource, resourceType, environment, manageOnly)
  );
  const options = resourceList.map(c => {
    const result = {
      label: c.offline ? `${c.name} - Offline` : c.name,
      value: c._id,
    };

    if (resourceType === 'connections') {
      return ({
        ...result,
        connInfo: {
          httpConnectorId: c?.http?._httpConnectorId,
          httpConnectorApiId: c?.http?._httpConnectorApiId,
          httpConnectorVersionId: c?.http?._httpConnectorVersionId,
        },
      });
    }

    return result;
  });
  const newId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );

  const handleTypeChange = (id, value) => {
    setUseNew(value === 'new');
    setRemountCount(remountCount => remountCount + 1);
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
  const formVal = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleSubmit = () => {
    if (!formVal[resourceName]) {
      return false;
    }

    onSubmitComplete(formVal[resourceName], true);
  };

  useFormInitWithPermissions({
    fieldMeta,
    formKey,
    remount: remountCount,
  });

  return (
    <LoadResources resources={resourceType}>
      <DrawerContent>
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
              formKey={formKey}
              heightOffset="250"
              occupyFullWidth
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={handleSubmitComplete}
            />
          ) : (
            <DynaForm formKey={formKey} />
          )}
        </div>
      </DrawerContent>
      {useNew ? (
        <ResourceFormActionsPanel
          formKey={formKey}
          resourceType={resourceType}
          resourceId={resourceId}
          submitButtonLabel="Save & close"
          cancelButtonLabel="Cancel"
          onSubmitComplete={handleSubmitComplete}
          connectionType={connectionType}
          onCancel={onClose} />
      ) : (
        <SaveAndCloseMiniResourceForm
          className={classes.doneBtn}
          formKey={formKey}
          submitButtonLabel="Done"
          handleSave={handleSubmit}
          shouldNotShowCancelButton
          handleCancel={onClose}
        />
      )}
    </LoadResources>
  );
}
