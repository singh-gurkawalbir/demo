import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../actions';
import { getAssistantConnectorType, getApp, getHttpConnector} from '../../../constants/applications';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../../sagas/resourceForm';
import useFormContext from '../../Form/FormContext';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import {useHFSetInitializeFormData} from './httpFramework/DynaHFAssistantOptions';
import DynaSelect from './DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../constants';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../forms/formFactory/utils';
import { isAmazonHybridConnection, isLoopReturnsv2Connection, isAcumaticaEcommerceConnection, isMicrosoftBusinessCentralOdataConnection, isEbayFinanceConnection } from '../../../utils/assistant';
import TextToggle from '../../TextToggle';
import Help from '../../Help';

const useStyles = makeStyles({
  helpTextButton: {
    padding: 0,
  },
  connectorTextToggle: {
    marginRight: '0px !important',
  },
});
const emptyObj = {};
const isParent = true;

export default function FormView(props) {
  const classes = useStyles();
  const { resourceType, flowId, resourceId, value: containerValue, formKey, defaultValue, isTitleBar } = props;
  const formContext = useFormContext(formKey);
  const dispatch = useDispatch();
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const staggedResource = merged || emptyObject;
  const value = useMemo(() => {
    if (!isTitleBar) return containerValue;
    if (!staggedResource) return defaultValue;
    if (!staggedResource.http) return defaultValue;
    if (!staggedResource.http.formType) return defaultValue;

    return staggedResource?.http?.formType === 'assistant' ? 'false' : 'true';
  }, [staggedResource, containerValue, isTitleBar, defaultValue]);
  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObj
  );
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', staggedResource._connectionId) ||
      emptyObj
  );
  const connectorMetaData = useSelector(state =>
    selectors.httpConnectorMetaData(state, connection?.http?._httpConnectorId, connection?.http?._httpConnectorVersionId, connection?.http?._httpConnectorApiId)
  );
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: getAssistantConnectorType(staggedResource.assistant),
      assistant: staggedResource.assistant,
    })
  );

  const { assistant: assistantName, http } = connection;

  const isGraphql = http?.formType === 'graph_ql';
  const _httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId)?._id;
  const showHTTPFrameworkImport = resourceType === 'imports' && connectorMetaData?.import?.versions?.[0]?.resources?.length;
  const showHTTPFrameworkExport = resourceType === 'exports' && connectorMetaData?.export?.versions?.[0]?.resources?.length;
  const isHttpFramework = showHTTPFrameworkImport || showHTTPFrameworkExport;

  const options = useMemo(() => {
    const matchingApplication = getApp(null, isGraphql ? 'graph_ql' : assistantName, _httpConnectorId);

    if (matchingApplication) {
      const { name, type } = matchingApplication;

      if (_httpConnectorId) {
        // all types are lower case...lets upper case them
        return [
          { label: 'Simple', value: `${!isParent}` },
          // if type is REST then we should show REST API
          { label: (isGraphql || _httpConnectorId) ? 'HTTP' : type && (type.toUpperCase() === 'REST' ? 'REST API' : type.toUpperCase()), value: `${isParent}` },
        ];
      }

      return [
        {
          items: [
            // if type is REST then we should show REST API
            { label: (isGraphql || _httpConnectorId) ? 'HTTP' : type && (type.toUpperCase() === 'REST' ? 'REST API' : type.toUpperCase()), value: `${isParent}` },
            { label: name, value: `${!isParent}` },
          ],
        },
      ];
    }

    // if i cant find a matching application this is not an assistant

    return null;
  }, [_httpConnectorId, assistantName, isGraphql]);

  useHFSetInitializeFormData({...props, isHTTPFramework: _httpConnectorId});
  useSetInitializeFormData({...props, isHTTPFramework: _httpConnectorId});

  const onFieldChangeFn = selectedApplication => {
    // first get the previously selected application values
    // stagged state we will break up the scope to selected application and actual value

    // selecting the other option
    const {id} = props;
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
      assistantData: _httpConnectorId ? connectorMetaData : assistantData,
    });
    const finalValues = preSave(formContext.value, staggedRes, { connection });
    const newFinalValues = {...finalValues};

    staggedRes['/useParentForm'] = selectedApplication === `${isParent}`;

    // if assistant is selected back again assign it to the export to the export obj as well
    if (_httpConnectorId && !isGraphql) {
      staggedRes['/isHttpConnector'] = true;
      newFinalValues['/isHttpConnector'] = true;
      if (selectedApplication !== `${isParent}`) {
        staggedRes['/http/formType'] = 'assistant';
        newFinalValues['/http/formType'] = 'assistant';
      } else {
        // set http.formType prop to http to use http form from the export/import as it is now using parent form');
        staggedRes['/http/formType'] = 'http';
        newFinalValues['/http/formType'] = 'http';
      }
    } else if (
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

  if (_httpConnectorId && !isHttpFramework && !isGraphql) {
    return null;
  }
  const titleBarFormView = isTitleBar ? (
    <>
      <TextToggle
        value={value}
        onChange={onFieldChangeFn}
        exclusive
        options={options}
        className={classes.connectorTextToggle}
      />
      <Help
        title="Formview"
        className={classes.helpTextButton}
        helpKey="formView"
      />
    </>
  ) : null;
  const containerFormView = !isTitleBar ? (
    <DynaSelect
      {...props}
      onFieldChange={(id, selectedApplication) => onFieldChangeFn(selectedApplication)}
      value={value}
      options={options}
/>
  ) : null;
  const insideFormView = isFlowBuilderAssistant
    ? containerFormView : null;

  // Show form view for both flow builder and standalone export/import when _httpConnectorId is present.
  return _httpConnectorId
    ? titleBarFormView : insideFormView;
}
