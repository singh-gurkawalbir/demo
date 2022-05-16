import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { getApp, getAssistantConnectorType } from '../../../constants/applications';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../../sagas/resourceForm';
import useFormContext from '../../Form/FormContext';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import DynaSelect from './DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../forms/formFactory/utils';
import { isAmazonHybridConnection, isLoopReturnsv2Connection, isAcumaticaEcommerceConnection, isMicrosoftBusinessCentralOdataConnection, isEbayFinanceConnection } from '../../../utils/assistant';

const emptyObj = {};
const isParent = true;

export default function FormView(props) {
  const { resourceType, flowId, resourceId, value, formKey } = props;
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
      adaptorType: getAssistantConnectorType(staggedResource.assistant),
      assistant: staggedResource.assistant,
    })
  );
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', staggedResource._connectionId) ||
      emptyObj
  );
  const { assistant: assistantName, http } = connection;
  const isGraphql = http?.formType === 'graph_ql';

  const options = useMemo(() => {
    const matchingApplication = getApp(null, isGraphql ? 'graph_ql' : assistantName);

    if (matchingApplication) {
      const { name, type } = matchingApplication;

      // all types are lower case...lets upper case them
      return [
        {
          items: [
            // if type is REST then we should show REST API
            { label: isGraphql ? 'HTTP' : type && (type.toUpperCase() === 'REST' ? 'REST API' : type.toUpperCase()), value: `${isParent}` },
            { label: name, value: `${!isParent}` },
          ],
        },
      ];
    }

    // if i cant find a matching application this is not an assistant

    return null;
  }, [assistantName, isGraphql]);

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
    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: staggedResource,
      isNew: false,
      connection,
      assistantData,
    });
    const finalValues = preSave(formContext.value, staggedRes, { connection });
    const newFinalValues = {...finalValues};

    staggedRes['/useParentForm'] = selectedApplication === `${isParent}`;

    // if assistant is selected back again assign it to the export to the export obj as well
    if (
      selectedApplication !== `${isParent}` &&
      staggedRes['/assistant'] === undefined &&
      !isGraphql
    ) {
      staggedRes['/assistant'] = assistantName;
    } else if (isGraphql) {
      if (selectedApplication !== `${isParent}`) {
        staggedRes['/http/formType'] = 'graph_ql';
      } else {
        // set http.formType prop to http to use http form from the export/import as it is now using parent form');
        staggedRes['/http/formType'] = 'http';
        newFinalValues['/http/formType'] = 'http';
      }
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
        flowId,
        allTouchedFields
      )
    );
  };
  const isAcumaticaEcommerceImport = (resourceType === 'imports') && isAcumaticaEcommerceConnection(connection);
  const isLoopReturnsv2import = (resourceType === 'imports') && isLoopReturnsv2Connection(connection);
  const isEbayFinanceImport = (resourceType === 'imports') && isEbayFinanceConnection(connection);
  const isFlowBuilderAssistant = flowId && (isGraphql ||
    (assistantName && assistantName !== 'financialforce' && !isAmazonHybridConnection(connection) && !isMicrosoftBusinessCentralOdataConnection(connection) && !isAcumaticaEcommerceImport && !isLoopReturnsv2import && !isEbayFinanceImport));

  return isFlowBuilderAssistant ? (
    <DynaSelect
      {...props}
      onFieldChange={onFieldChangeFn}
      value={value}
      options={options}
    />
  ) : null;
}
