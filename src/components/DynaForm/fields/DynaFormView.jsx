import React, { useMemo } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { getApp } from '../../../constants/applications';
import formFactory from '../../../forms/formFactory';
import {
  defaultPatchSetConverter,
  sanitizePatchSet,
} from '../../../forms/utils';
import * as selectors from '../../../reducers';
import { SCOPES } from '../../../sagas/resourceForm';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import DynaSelect from './DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';

const emptyObj = {};
const isParent = true;
export function FormView(props) {
  const { resourceType, flowId, resourceId, formContext, value } = props;
  const dispatch = useDispatch();
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const staggedResource = merged || emptyObject;
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
  const { assistant: assistantName } = connection;
  const options = useMemo(() => {
    const matchingApplication = getApp(null, assistantName);

    if (matchingApplication) {
      const { name, type } = matchingApplication;

      // all types are lower case...lets upper case them
      return [
        {
          items: [
            { label: type && type.toUpperCase(), value: `${isParent}` },
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

    // if assistant is selected back again assign it to the export to the export obj as well
    if (
      selectedApplication !== `${isParent}` &&
      staggedRes['/assistant'] === undefined
    ) staggedRes['/assistant'] = assistantName;

    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...staggedRes, ...finalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches, SCOPES.VALUE)
    );

    let allTouchedFields = formContext.fields
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value }));

    // When we initialize we always have the selected form view field touched
    allTouchedFields = [
      ...allTouchedFields,
      { id, value: selectedApplication },
    ];
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

  const isFlowBuilderAssistant =
    flowId && assistantName && assistantName !== 'financialforce';

  return isFlowBuilderAssistant ? (
    <DynaSelect
      {...props}
      onFieldChange={onFieldChangeFn}
      value={value}
      options={options}
    />
  ) : null;
}

export default function DynaFormView(props) {
  return (
    <FormContext.Consumer>
      {form => <FormView formContext={form} {...props} />}
    </FormContext.Consumer>
  );
}
