import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../actions';
import { getApp, getHttpConnector} from '../../../constants/applications';
import { selectors } from '../../../reducers';
import useFormContext from '../../Form/FormContext';
import {useHFSetInitializeFormData} from './httpFramework/DynaHFAssistantOptions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../constants';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, handleIsRemoveLogic, sanitizePatchSet } from '../../../forms/formFactory/utils';
import TextToggle from '../../TextToggle';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  connectorTextToggle: {
    flexGrow: 100,
    marginLeft: theme.spacing(-2),
  },
}));
const emptyObj = {};
const isParent = true;

export default function DynaHTTPFrameworkBubbleFormView(props) {
  const classes = useStyles();
  const { resourceType, flowId, resourceId, formKey } = props;
  const formContext = useFormContext(formKey);
  const dispatch = useDispatch();
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const stagedResource = merged || emptyObject;
  const value = useMemo(() => {
    if (!stagedResource || !stagedResource.http || !stagedResource.http.sessionFormType) return 'false';

    return stagedResource.http?.sessionFormType === 'assistant' ? 'false' : 'true';
  }, [stagedResource]);
  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObj
  );
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', stagedResource._connectionId) ||
      emptyObj
  );
  const connectorMetaData = useSelector(state =>
    selectors.httpConnectorMetaData(state, connection?.http?._httpConnectorId, connection?.http?._httpConnectorVersionId, connection?.http?._httpConnectorApiId)
  );

  const { assistant: assistantName } = connection;

  const _httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId)?._id;
  const showHTTPFrameworkImport = resourceType === 'imports' && connectorMetaData?.import?.resources?.[0]?.operations?.length;
  const showHTTPFrameworkExport = resourceType === 'exports' && connectorMetaData?.export?.resources?.[0]?.endpoints?.length;
  const isHttpFramework = showHTTPFrameworkImport || showHTTPFrameworkExport;

  const options = useMemo(() => {
    const matchingApplication = getApp(null, assistantName, _httpConnectorId);

    if (matchingApplication) {
      const { type } = matchingApplication;

      // all types are lower case...lets upper case them
      return [
        { label: 'Simple', value: `${!isParent}` },
        // if type is REST then we should show REST API
        { label: (_httpConnectorId) ? 'HTTP' : type && (type.toUpperCase() === 'REST' ? 'REST API' : type.toUpperCase()), value: `${isParent}` },
      ];
    }

    // if i cant find a matching application this is not an assistant

    return null;
  }, [_httpConnectorId, assistantName]);

  useHFSetInitializeFormData({...props, isHTTPFramework: _httpConnectorId});
  if (!_httpConnectorId || !isHttpFramework) {
    return null;
  }
  const onFieldChangeFn = selectedApplication => {
    // first get the previously selected application values
    // staged state we will break up the scope to selected application and actual value

    // selecting the other option
    const {id} = props;
    const stagedRes = Object.keys(stagedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = stagedResource[curr];

      return acc;
    }, {});

    // use this function to get the corresponding preSave function for this current form
    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: stagedResource,
      isNew: false,
      connection,
      assistantData: connectorMetaData,
    });
    let finalValues = preSave(formContext.value, stagedRes, { connection });

    finalValues = handleIsRemoveLogic(formContext.fields, finalValues);

    const newFinalValues = {...finalValues};

    stagedRes['/useParentForm'] = selectedApplication === `${isParent}`;

    // if assistant is selected back again assign it to the export to the export obj as well
    if (_httpConnectorId) {
      stagedRes['/isHttpConnector'] = true;
      newFinalValues['/isHttpConnector'] = true;
      if (selectedApplication !== `${isParent}`) {
        stagedRes['/http/sessionFormType'] = 'assistant';
        newFinalValues['/http/sessionFormType'] = 'assistant';
      } else {
        // set http.sessionFormType prop to http to use http form from the export/import as it is now using parent form');
        stagedRes['/http/sessionFormType'] = 'http';
        newFinalValues['/http/sessionFormType'] = 'http';
      }
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

  return (
    <div className={classes.connectorTextToggle}>
      <TextToggle
        value={value}
        onChange={onFieldChangeFn}
        exclusive
        options={options}
      />
      <Help
        title="Formview"
        helpKey="connectionFormView"
      />
    </div>
  );
}
