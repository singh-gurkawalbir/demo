import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { getApp } from '../../../constants/applications';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../../sagas/resourceForm';
import useFormContext from '../../Form/FormContext';
import {useHFSetInitializeFormData} from './httpFramework/DynaHFAssistantOptions';
import DynaSelect from './DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../forms/formFactory/utils';

const emptyObj = {};
const isParent = true;

export default function FormView(props) {
  const { resourceType, resourceId, value, formKey } = props;

  const formContext = useFormContext(formKey);
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

  const _httpConnectorId = staggedResource?.http?._httpConnectorId || staggedResource?._httpConnectorId;

  const options = useMemo(() => {
    const matchingApplication = getApp(null, null, _httpConnectorId);

    if (matchingApplication) {
      const { name } = matchingApplication;

      // all types are lower case...lets upper case them
      return [
        {
          items: [
            // if type is REST then we should show REST API
            { label: 'HTTP', value: `${isParent}` },
            { label: name, value: `${!isParent}` },
          ],
        },
      ];
    }

    // if i cant find a matching application this is not an assistant

    return null;
  }, [_httpConnectorId]);

  useHFSetInitializeFormData({...props, isHTTPFramework: _httpConnectorId});

  const onFieldChangeFn = (id, selectedApplication) => {
    // first get the previously selected application values
    // stagged state we will break up the scope to selected application and actual value

    // selecting the other option

    const staggedRes = Object.keys(staggedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = staggedResource[curr];

      return acc;
    }, {});

    // use this function to get the corresponding preSave function for this current form
    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: staggedResource,
      isNew: false,
    });
    const finalValues = preSave(formContext.value, staggedRes);
    const newFinalValues = {...finalValues};

    staggedRes['/useParentForm'] = selectedApplication === `${isParent}`;

    // if assistant is selected back again assign it to the export to the export obj as well

    if (selectedApplication !== `${isParent}`) {
      staggedRes['/http/formType'] = 'assistant';
      newFinalValues['/http/formType'] = 'assistant';
    } else {
      // set http.formType prop to http to use http form from the export/import as it is now using parent form');
      staggedRes['/http/formType'] = 'http';
      newFinalValues['/http/formType'] = 'http';
    }
    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...staggedRes, ...newFinalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches, SCOPES.VALUE)
    );

    let allTouchedFields = Object.values(formContext.fields)
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
        allTouchedFields
      )
    );
  };

  if (!_httpConnectorId) {
    return null;
  }

  return (
    <DynaSelect
      {...props}
      onFieldChange={onFieldChangeFn}
      value={value}
      options={options}
    />
  );
}
