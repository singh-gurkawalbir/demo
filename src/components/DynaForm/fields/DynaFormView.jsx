import { FormContext } from 'react-forms-processor/dist';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import jsonPatch, { deepClone } from 'fast-json-patch';
import actions from '../../../actions';
import definitions from '../../../forms/definitions';
import {
  defaultPatchSetConverter,
  sanitizePatchSet,
} from '../../../forms/utils';
import DynaRadio from './radiogroup/DynaRadioGroup';
import * as selectors from '../../../reducers';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import { SCOPES } from '../../../sagas/resourceForm';
import { getApplicationConnectors } from '../../../constants/applications';

export function FormView(props) {
  const { resourceType, flowId, resourceId, formContext } = props;
  const dispatch = useDispatch();
  const staggedResourceSelector = useSelector(state => scope =>
    selectors.stagedResource(state, resourceId, scope)
  );
  const resource = useSelector(
    state => selectors.resource(state, resourceType, resourceId) || {}
  );
  const staggedResource = useSelector(
    state => selectors.resourceData(state, resourceType, resourceId) || {}
  );
  const options = useMemo(() => {
    let assistantName;

    if (
      staggedResource &&
      staggedResource.merged &&
      staggedResource.merged.assistant
    )
      assistantName = staggedResource.merged.assistant;
    else {
      const allStaggedPatches = staggedResourceSelector(null).patch;
      const assistantPatch = allStaggedPatches.find(patch =>
        patch.scope.includes(`${SCOPES.VALUE}-`)
      );

      assistantName =
        assistantPatch && assistantPatch.scope.replace(`${SCOPES.VALUE}-`, '');
    }

    const matchingApplication = getApplicationConnectors().find(
      con => con.assistant === assistantName
    );

    if (matchingApplication) {
      const { name, assistant, type } = matchingApplication;

      return [
        {
          items: [
            { label: type, value: type },
            { label: name, value: assistant },
          ],
        },
      ];
    }

    return null;
  }, [staggedResource, staggedResourceSelector]);
  const selectedOption = useMemo(() => {
    if (!options || !options[0] || !options[0].items || !options[0].items[1])
      return null;

    // assistant
    if (
      staggedResource &&
      staggedResource.merged &&
      staggedResource.merged.assistant
    ) {
      // Assistant is always second option
      return options[0].items[1].value;
    }

    return options[0].items[0].value;
  }, [options, staggedResource]);

  useSetInitializeFormData(props);
  const onFieldChangeFn = (id, selectedApplication) => {
    // first get the previously selected application values
    // stagged state we will break up the scope to selected application and actual value

    const backupStaggedChanges = deepClone(
      staggedResourceSelector(SCOPES.VALUE).patch
    );
    const backUpFormValuesPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter(formContext.value),
      resource,
    });
    const backUpCurrentApplicationPatches = [
      ...backupStaggedChanges,
      ...backUpFormValuesPatches,
    ];
    const meta = definitions[resourceType].new;
    const allNewResourceTypeFormValues = Object.values(meta.fieldMap).map(
      fieldMap => fieldMap.name
    );
    const carryForwardPatches = backupStaggedChanges.filter(val =>
      allNewResourceTypeFormValues.includes(val.path)
    );
    const selectedApplicationPatches = deepClone(
      staggedResourceSelector(`${SCOPES.VALUE}-${selectedApplication}`).patch
    );

    dispatch(actions.resource.clearStaged(resourceId));

    if (!selectedApplicationPatches || !selectedApplicationPatches.length) {
      let newFormValue = jsonPatch.applyPatch({}, carryForwardPatches)
        .newDocument;

      newFormValue = Object.keys(newFormValue).reduce((acc, key) => {
        acc[`/${key}`] = newFormValue[key];

        return acc;
      }, {});

      newFormValue = { ...newFormValue, application: selectedApplication };
      newFormValue = definitions[resourceType].new.preSave(newFormValue);

      dispatch(
        actions.resource.patchStaged(
          resourceId,
          sanitizePatchSet({
            patchSet: defaultPatchSetConverter(newFormValue),
            resource,
          }),
          SCOPES.VALUE
        )
      );
    } else {
      dispatch(
        actions.resource.patchStaged(
          resourceId,
          selectedApplicationPatches,
          SCOPES.VALUE
        )
      );
    }

    // selecting the other option
    dispatch(
      actions.resource.patchStaged(
        resourceId,
        backUpCurrentApplicationPatches,
        `${SCOPES.VALUE}-${
          options[0].items.filter(opt => opt.value !== selectedApplication)[0]
            .value
        }`
      )
    );

    const allTouchedFields = formContext.fields
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value }));

    allTouchedFields.push({ id, value: selectedApplication });
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

  return flowId && options ? (
    <DynaRadio
      {...props}
      value={selectedOption}
      onFieldChange={onFieldChangeFn}
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
