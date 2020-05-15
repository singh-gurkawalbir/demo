import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import RadioGroup from '../../components/DynaForm/fields/radiogroup/DynaRadioGroup';
import ResourceFormWithStatusPanel from '../../components/ResourceFormWithStatusPanel';
import DynaForm from '../../components/DynaForm';
import * as selectors from '../../reducers';
import LoadResources from '../LoadResources';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import {
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
} from '../../constants/resource';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  resourceFormWrapper: {
    padding: theme.spacing(3),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
  },
  resourceFormRadioGroupWrapper: {
    marginBottom: theme.spacing(2),
  },
}));

// TODO Sravan - Cancel button doesnt work.
export default function AddOrSelect(props) {
  const {
    resourceId,
    onSubmitComplete,
    connectionType,
    resource,
    environment,
    resourceType = 'connections',
  } = props;
  const classes = useStyles();
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

  const formKey = useFormInitWithPermissions({
    fieldsMeta: fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <LoadResources resources={resourceType}>
      <div className={classes.resourceFormWrapper}>
        <RadioGroup
          {...props}
          id="selectType"
          className={classes.resourceFormRadioGroupWrapper}
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
        {/* div wrapping is imp. since child component is reusable component and it inherits parent top parent. Validate before removing */}
        <div>
          {useNew ? (
            <ResourceFormWithStatusPanel
              heightOffset="250"
              occupyFullWidth
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={handleSubmitComplete}
              connectionType={connectionType}
            />
          ) : (
            <Fragment>
              <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
              <DynaSubmit formKey={formKey} onClick={handleSubmit}>
                Done
              </DynaSubmit>
            </Fragment>
          )}
        </div>
      </div>
    </LoadResources>
  );
}
