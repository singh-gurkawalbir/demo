import React, { useState, useMemo, useCallback } from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { FormLabel } from '@mui/material';
import clsx from 'clsx';
import FieldHelp from '../../FieldHelp';
import useFormContext from '../../../Form/FormContext';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { emptyObject } from '../../../../constants';
import {useHFSetInitializeFormData} from './DynaHFAssistantOptions';
import getResourceFormAssets from '../../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, handleIsRemoveLogic, sanitizePatchSet } from '../../../../forms/formFactory/utils';
import MultiApiSelect from '../../../MultiApiSelect';
import FieldMessage from '../FieldMessage';

const useStyles = makeStyles(() => ({
  fieldWrapper: {
    width: '100%',
  },
}));

export default function APISelect(props) {
  const {
    required,
    isValid,
    errorMessages,
    label,
    id,
    formKey,
    resourceType,
    resourceId,
    defaultValue,
  } = props;

  const classes = useStyles();
  const formContext = useFormContext(formKey);
  const dispatch = useDispatch();

  const { merged } =
  useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ) || {};
  const stagedResource = merged || emptyObject;

  const httpConnectorData = useSelector(state => selectors.connectorData(state, stagedResource?.http?._httpConnectorId || stagedResource?._httpConnectorId), shallowEqual);
  const data = useMemo(() => httpConnectorData?.apis?.map(({name, _id, description}) => ({name, id: _id, description})), [httpConnectorData?.apis]);
  const val = useMemo(() => {
    if (!stagedResource || !stagedResource.http || !stagedResource.http._httpConnectorApiId) return defaultValue;

    return stagedResource.http?._httpConnectorApiId;
  }, [stagedResource, defaultValue]);

  const [value, setValue] = useState(val);
  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObject
  );
  const accountOwner = useSelector(() => selectors.accountOwner(), shallowEqual);

  useHFSetInitializeFormData({...props, isHTTPFramework: stagedResource?.http?._httpConnectorId || stagedResource?._httpConnectorId});

  const handleClick = useCallback(val => {
    setValue(val);
    const stagedRes = Object.keys(stagedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = stagedResource[curr];

      return acc;
    }, {});

    // use this function to get the corresponding preSave function for this current form
    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: stagedResource,
      isNew: false,
      accountOwner,
    });
    let finalValues = preSave(formContext.value, stagedRes);

    finalValues = handleIsRemoveLogic(formContext.fields, finalValues);

    const newFinalValues = {...finalValues};

    if (val) {
      stagedRes['/http/_httpConnectorApiId'] = val;
      newFinalValues['/http/_httpConnectorApiId'] = val;
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

    // When we initialize we always have the selected form view field touched
    allTouchedFields = [
      ...allTouchedFields,
      { id, value: val },
    ];
    allTouchedFields = allTouchedFields.filter(field => ['name', 'http._httpConnectorApiId'].includes(field.id));
    dispatch(
      actions.resourceForm.init(
        resourceType,
        resourceId,
        false,
        false,
        '',
        allTouchedFields,
        '',
        '',
        '',
        {apiChange: true}
      )
    );
  }, [accountOwner, dispatch, formContext?.fields, formContext?.value, id, resourceFormState.fieldMeta, resourceId, resourceType, stagedResource]);

  if (!data || !data.length) {
    return null;
  }

  return (
    <div className={clsx(classes.fieldWrapper)}>
      <FormLabel required={required} htmlFor={label} error={!isValid}>
        {label}
      </FormLabel>
      <FieldHelp {...props} />
      <MultiApiSelect items={data} value={value} onClick={handleClick} />
      <FieldMessage errorMessages={errorMessages} isValid={isValid} />
    </div>
  );
}
