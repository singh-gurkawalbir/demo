import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core';
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
  helpTextButton: {
    padding: 0,
  },
  connectorTextToggle: {
    flexGrow: 100,
    marginLeft: theme.spacing(-1),
  },
  textToggle: {
    '&>.MuiButtonBase-root': {
      minWidth: 'auto',
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
  },
}));
const emptyObj = {};
export default function FormView(props) {
  const classes = useStyles();
  const { resourceType, resourceId, defaultValue, formKey, sourceForm} = props;

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
    if (!stagedResource || !stagedResource.http || !stagedResource.http.sessionFormType) return defaultValue;

    return stagedResource.http?.sessionFormType === 'assistant' ? 'false' : 'true';
  }, [stagedResource, defaultValue]);

  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObj
  );

  const accountOwner = useSelector(() => selectors.accountOwner(), shallowEqual);

  let _httpConnectorId = stagedResource?.http?._httpConnectorId || stagedResource?._httpConnectorId;

  _httpConnectorId = getHttpConnector(_httpConnectorId)?._id;

  const options = useMemo(() => {
    const matchingApplication = getApp(null, null, _httpConnectorId);

    if (matchingApplication) {
      return [
        { label: 'Simple', value: 'false' },
        { label: 'HTTP', value: 'true' },
      ];
    }

    return null;
  }, [_httpConnectorId]);

  useHFSetInitializeFormData({...props, isHTTPFramework: _httpConnectorId});

  const onFieldChangeFn = useCallback(selectedApplication => {
    // first get the previously selected application values
    // stagged state we will break up the scope to selected application and actual value

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
      accountOwner,
    });
    let finalValues = preSave(formContext.value, stagedRes);

    finalValues = handleIsRemoveLogic(formContext.fields, finalValues);
    const newFinalValues = {...finalValues};

    // if assistant is selected back again assign it to the export to the export obj as well

    if (selectedApplication !== 'true') {
      stagedRes['/http/sessionFormType'] = 'assistant';
      newFinalValues['/http/sessionFormType'] = 'assistant';
      dispatch(
        actions.analytics.gainsight.trackEvent('CONNECTION_FORM_VIEW', {
          'Toggle Mode': 'Simple',
          UserID: getHttpConnector(_httpConnectorId)._userId,
          Connector: getHttpConnector(_httpConnectorId).name,
        })
      );
    } else {
      // set http.sessionFormType prop to http to use http form from the export/import as it is now using parent form');
      stagedRes['/http/sessionFormType'] = 'http';
      newFinalValues['/http/sessionFormType'] = 'http';
      dispatch(
        actions.analytics.gainsight.trackEvent('CONNECTION_FORM_VIEW', {
          'Toggle Mode': 'HTTP',
          UserID: getHttpConnector(_httpConnectorId)._userId,
          Connector: getHttpConnector(_httpConnectorId).name,
        })
      );
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
        '',
        allTouchedFields
      )
    );
  }, [_httpConnectorId, accountOwner, dispatch, formContext.fields, formContext.value, props, resourceFormState.fieldMeta, resourceId, resourceType, stagedResource]);

  if (!_httpConnectorId || !sourceForm || stagedResource?._connectorId) {
    return null;
  }

  return (
    <div className={classes.connectorTextToggle}>
      <TextToggle
        value={value}
        onChange={onFieldChangeFn}
        exclusive
        options={options}
        className={classes.textToggle}
      />
      <Help
        title="Formview"
        className={classes.helpTextButton}
        helpKey="connectionFormView"
      />
    </div>
  );
}
