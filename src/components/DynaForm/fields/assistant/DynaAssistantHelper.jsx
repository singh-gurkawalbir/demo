import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isObject } from 'lodash';
import actions from '../../../../actions';
import {
  defaultPatchSetConverter,
  sanitizePatchSet,
} from '../../../../forms/utils';
import { selectors } from '../../../../reducers';
import { SCOPES } from '../../../../sagas/resourceForm';
import { useSetInitializeFormData } from './DynaAssistantOptions';
import DynaSelect from '../DynaSelect';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../../utils/constants';
import { exportHelperOptions, getHttpConfig } from './util';
import useConfirmDialog from '../../../ConfirmDialog';
import useFormContext from '../../../Form/FormContext';
import formFactory from '../../../../forms/formFactory';

const emptyObj = {};

export default function DynaAssistantHelper(props) {
  const { resourceType, flowId, resourceId, formKey, value } = props;
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

  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: ['RESTExport', 'RESTImport'].includes(staggedResource.adaptorType)
        ? 'rest'
        : 'http',
      assistant: staggedResource.assistant,
    })
  );

  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', staggedResource._connectionId) ||
      emptyObj
  );
  const { assistant: assistantName } = connection;
  const options = useMemo(() =>
    // all types are lower case...lets upper case them
    [
      {
        items: exportHelperOptions(assistantData?.export?.endpoints?.[0]?.children, {key: [assistantData?.export?.endpoints?.[0].key]}),
      },
    ],

  // if i cant find a matching application this is not an assistant

  [assistantData?.export?.endpoints]);

  useSetInitializeFormData(props);
  const convertToHttpConfigAndPatch = (id, selectedApplication) => {
    const assistantConfig = getHttpConfig(assistantData, selectedApplication);
    const assistantConfigPatchSet = Object.keys(assistantConfig.http).reduce((acc, curr) => {
      if (isObject(assistantConfig.http[curr])) {
        Object.keys(assistantConfig.http[curr]).reduce((acc1, curr1) => {
          acc1[`/http/${curr}/${curr1}`] = assistantConfig.http[curr][curr1];

          return acc1;
        }, acc);
      } else {
        acc[`/http/${curr}`] = assistantConfig.http[curr];
      }

      return acc;
    }, {});

    const staggedRes = Object.keys(staggedResource).reduce((acc, curr) => {
      if (curr !== 'http') {
        acc[`/${curr}`] = staggedResource[curr];
      }

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

    Object.keys(finalValues).forEach(key => {
      if (key.startsWith('/http')) {
        if (Object.hasOwnProperty.call(assistantConfigPatchSet, key)) {
          finalValues[key] = assistantConfigPatchSet[key];
        } else {
          finalValues[key] = undefined;
        }
      }
    });
    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...staggedRes, ...finalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches, SCOPES.VALUE)
    );

    let allTouchedFields = Object.values(formContext.fields)
      .filter(field => !!field.touched && !field.id.startsWith('http.'))
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
  const { confirmDialog } = useConfirmDialog();
  const onFieldChangeFn = (id, selectedApplication) => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to clear and populate?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            convertToHttpConfigAndPatch(id, selectedApplication);
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  };

  const showAssistantHelper = flowId && assistantName === 'openair';

  return showAssistantHelper ? (
    <DynaSelect
      {...props}
      onFieldChange={onFieldChangeFn}
      value={value}
      options={options}
    />
  ) : null;
}

