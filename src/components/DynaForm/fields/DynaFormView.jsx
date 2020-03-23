import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import actions from '../../../actions';
import {
  defaultPatchSetConverter,
  sanitizePatchSet,
} from '../../../forms/utils';
import DynaRadio from './radiogroup/DynaRadioGroup';
import * as selectors from '../../../reducers';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import { SCOPES } from '../../../sagas/resourceForm';
import formFactory from '../../../forms/formFactory';
import { getApp } from '../../../constants/applications';
import useFormContext from '../../Form/FormContext';

const emptyObj = {};
const isParent = true;

export function FormView(props) {
  const { resourceType, flowId, resourceId, formContext } = props;
  const dispatch = useDispatch();
  const staggedResource = useSelector(state => {
    const { merged } =
      selectors.resourceData(state, resourceType, resourceId) || {};

    return merged || emptyObj;
  });
  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObj
  );
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: staggedResource.adaptorType,
      assistant: staggedResource.assistant,
    })
  );
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', staggedResource._connectionId) ||
      emptyObj
  );
  const { assistant: assistantName } = staggedResource;
  const options = useMemo(() => {
    const matchingApplication = getApp(null, assistantName);

    if (matchingApplication) {
      const { name, type } = matchingApplication;

      return [
        {
          items: [
            { label: type, value: `${isParent}` },
            { label: name, value: `${!isParent}` },
          ],
        },
      ];
    }

    // if i cant find a matching application this is not an assistant

    return null;
  }, [assistantName]);

  useSetInitializeFormData(props);
  const onFieldChangeFn = (id, selectedApplication) => {
    // first get the previously selected application values
    // stagged state we will break up the scope to selected application and actual value

    // selecting the other option

    const staggedRes = Object.keys(staggedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = staggedResource[curr];

      return acc;
    }, {});
    // use this function to get the corresponding preSave function for this current form
    const { preSave } = formFactory.getResourceFormAssets({
      resourceType,
      resource: staggedResource,
      isNew: false,
      connection,
      assistantData,
    });
    const finalValues = preSave(formContext.value, staggedRes);

    staggedRes['/useParentForm'] = selectedApplication === `${isParent}`;

    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...staggedRes, ...finalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches, SCOPES.VALUE)
    );

    const allTouchedFields = formContext.fields
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value }));

    dispatch(
      actions.resourceForm.init(
        resourceType,
        resourceId,
        false,
        false,
        flowId,
        allTouchedFields
      )
    );
  };

  const isFlowBuilderAssistant = flowId && staggedResource.assistant;

  return isFlowBuilderAssistant ? (
    <DynaRadio
      {...props}
      onFieldChange={onFieldChangeFn}
      value={`${!!staggedResource.useParentForm}`}
      options={options}
    />
  ) : null;
}

export default function DynaFormView(props) {
  const form = useFormContext(props);

  return <FormView formContext={form} {...props} />;
}
