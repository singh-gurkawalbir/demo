import { FormContext } from 'react-forms-processor/dist';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import definitions from '../../../forms/definitions';
import {
  defaultPatchSetConverter,
  sanitizePatchSet,
} from '../../../forms/utils';
import DynaRadio from './radiogroup/DynaRadioGroup';
import * as selectors from '../../../reducers';

export function FormView(props) {
  const { resourceType, flowId, resourceId, formContext } = props;
  const dispatch = useDispatch();
  const staggedResource = useSelector(state =>
    selectors.stagedResource(state, resourceId)
  );
  const onFieldChangeFn = (id, selectedApplication) => {
    let value = {
      ...formContext.value,
      application: selectedApplication,
    };
    const meta = definitions[resourceType].new;
    const allNewResourceTypeFormValues = Object.values(meta.fieldMap).map(
      fieldMap => fieldMap.name
    );
    const carryForwardPatches = staggedResource.patch.filter(val =>
      allNewResourceTypeFormValues.includes(val.path)
    );

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(actions.resource.patchStaged(resourceId, carryForwardPatches));

    value = definitions[resourceType].new.preSave(value);
    // Will stage the resource with the right set of values

    const patches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter(value),
      resource: {},
    });

    dispatch(actions.resource.patchStaged(resourceId, patches));

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

  return flowId ? (
    <DynaRadio
      {...props}
      onFieldChange={onFieldChangeFn}
      options={[
        {
          items: [
            { label: 'http', value: 'http' },
            { label: '3dCart', value: '3dcart' },
          ],
        },
      ]}
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
