import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { emptyObject } from '../../../../constants';
import getResourceFormAssets from '../../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../../forms/formFactory/utils';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import useFormContext from '../../../Form/FormContext';
import DynaSelect from '../DynaSelect';

export default function IclientSelect(props) {
  const {
    resourceType,
    resourceId,
    formKey,
  } = props;

  const formContext = useFormContext(formKey);
  const dispatch = useDispatch();
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const stagedResource = merged || emptyObject;
  const accountOwner = useSelector(() => selectors.accountOwner(), shallowEqual);
  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObject
  );
  const handleClick = useCallback((id, selectedValue) => {
    const stagedRes = Object.keys(stagedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = stagedResource[curr];

      return acc;
    }, {});

    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: stagedResource,
      isNew: false,
      accountOwner,
    });
    const newFinalValues = { ...preSave(formContext.value, stagedRes) };

    if (selectedValue) {
      stagedRes['/application'] = selectedValue;
      newFinalValues['/application'] = selectedValue;
    }
    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...stagedRes, ...newFinalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches)
    );

    let allTouchedFields = Object.values(formContext.fields)
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value }));

    allTouchedFields = [
      ...allTouchedFields,
      { id, value: selectedValue },
    ];
    dispatch(
      actions.resourceForm.init(
        resourceType,
        resourceId,
        false,
        false,
        '',
        allTouchedFields,
      )
    );
  }, [accountOwner, dispatch, formContext.fields, formContext.value, resourceFormState.fieldMeta, resourceId, resourceType, stagedResource]);

  return (

    <DynaSelect {...props} onFieldChange={handleClick} />
  );
}
