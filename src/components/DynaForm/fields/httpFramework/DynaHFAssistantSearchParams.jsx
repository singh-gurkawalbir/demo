import React, { useMemo, useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { isArray } from 'lodash';
import { KeyValueComponent } from '../DynaKeyValue';
import actions from '../../../../actions';
import { getValidRelativePath } from '../../../../utils/routePaths';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { isMetaRequiredValuesMet, PARAMETER_LOCATION } from '../../../../utils/assistant';
import { message } from '../../../../utils/messageStore';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FLOW_DATA_STAGE } from '../../../../utils/flowData';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  rowContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    marginBottom: 6,
  },
  dynaField: {
    flex: 1,
  },
  dynaKeyField: {
    marginRight: theme.spacing(0.5),
  },
  dynaValueField: {
    paddingLeft: theme.spacing(1),
    '& > div': {
      lineHeight: '36px',
    },
  },
  dynaKeyValueLabelWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaValueTitle: {
    paddingLeft: '28px',
    width: `calc(100% - ${theme.spacing(2)})`,
  },
}));

/* istanbul ignore next: KeyLabel is passed as list in props for children components */
const KeyLabel = ({id, description}) => (
  <div>
    <Typography>{id}</Typography>
    <Typography variant="caption" color="textSecondary" >{description}</Typography>
  </div>
);

// no user info mostly metadata releated values...can be loggable
export default function DynaHFAssistantSearchParams(props) {
  const {
    id,
    formKey,
    paramMeta,
    onFieldChange,
    resourceType,
    resourceId,
    flowId,
    value,
    required,
    keyName,
    valueName,
  } = props;
  let { label } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();

  const editorId = getValidRelativePath(id);
  const flowDataStage = resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE;
  const isMetaValid = isMetaRequiredValuesMet(paramMeta, value);
  const requiredFields = useMemo(() => paramMeta?.fields.filter(field => field.required).map(field => field.id), [paramMeta]);
  const valueFieldType = useMemo(() => paramMeta?.fields.reduce((fieldMap, {id, fieldType}) => ({...fieldMap, [id]: fieldType}), {}), [paramMeta]);

  const selectTypeList = useMemo(() => paramMeta?.fields.
       filter(({fieldType}) => fieldType.includes('select')).
       reduce((mapObj, {id, fieldType, options}) =>
         ({...mapObj, [id]: {options, supportsMultiple: fieldType === 'multiselect'}}),
         {}),
  [paramMeta]);

  const updatedValue = useMemo(() => {
    const keyValues = [];

    requiredFields.forEach(field => {
      !Object.keys(value).includes(field) && keyValues.push({
        name: field,
        disableRowKey: true,
        valueType: valueFieldType[field],
        isSelect: !!selectTypeList[field] && !selectTypeList[field].supportsMultiple,
        isMultiSelect: !!selectTypeList[field] && selectTypeList[field].supportsMultiple,
        options: selectTypeList[field] && selectTypeList[field].options.map(value => ({ name: value, value})),
      });
    });
    /* istanbul ignore else: value should never be undefined or null Otherwise need the same check above */
    if (value) {
      Object.keys(value).forEach(key => keyValues.push({
        name: key,
        value: value[key],
        disableRowKey: requiredFields.includes(key),
        valueType: valueFieldType[key],
        isSelect: !!selectTypeList[key] && !selectTypeList[key].supportsMultiple,
        isMultiSelect: !!selectTypeList[key] && selectTypeList[key].supportsMultiple,
        options: selectTypeList[key] && selectTypeList[key].options.map(value => ({ name: value, value})),
      }));
    }

    return keyValues;
  }, [requiredFields, selectTypeList, value, valueFieldType]);

  const dataFields = useMemo(() =>
    paramMeta.fields.map(({id, description}) => ({
      name: <KeyLabel id={id} description={description} />,
      value: id,
    })), [paramMeta.fields]);

  const suggestionConfig = useMemo(() => {
    const updatedDataFields = dataFields.filter(field => !Object.keys(value).includes(field.value));

    return ({
      keyConfig: {
        suggestions: updatedDataFields,
        labelName: 'name',
        valueName: 'value',
        showAllSuggestions: true,
      },
    });
  }, [dataFields, value]);

  useEffect(() => {
    if (!required) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    dispatch(actions.form.forceFieldState(formKey)(id, {isValid: isMetaValid, errorMessages: message.REQUIRED_MESSAGE}));
  }, [dispatch, formKey, id, isMetaValid, required]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  useEffect(() => {
    if (requiredFields && requiredFields.length > 0) {
      const valueKeys = Object.keys(value);
      const newValues = {};

      requiredFields.filter(field => !valueKeys.includes(field)).forEach(field => {
        newValues[field] = undefined;
      });
      Object.keys(newValues).length > 0 && onFieldChange(id, {...value, ...newValues});
    }
  }, [id, onFieldChange, requiredFields, value]);
  /* istanbul ignore next: handleSave not invoked in test script */
  const handleSave = useCallback(editorValues => {
    const newValue = {...value, [Object.keys(value)[editorValues.paramIndex]]: editorValues.rule};

    onFieldChange(id, newValue);
  }, [id, onFieldChange, value]);
  const handleEditorClick = useCallback(index => {
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: flowDataStage,
      onSave: handleSave,
      paramIndex: index,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, flowDataStage, handleSave, history, match.url]);

  const handleUpdate = useCallback(values => {
    const finalValue = values.reduce((fv, val) => {
      if (!val[keyName]) {
        return fv;
      }
      let value = val[valueName];

      if (value && !isArray(value) && val.valueType === 'array') {
        value = value.trim().split(',');
      }

      return { ...fv, [val[keyName]]: value};
    }, {});

    onFieldChange(id, finalValue);
  }, [id, keyName, onFieldChange, valueName]);

  if (!label) {
    label =
      paramMeta.paramLocation === PARAMETER_LOCATION.BODY
        ? 'Configure body parameters'
        : 'Query parameters';
  }

  return (
    <KeyValueComponent
      {...props}
      label={label}
      suggestionConfig={suggestionConfig}
      dataTest="queryParameters"
      helpText={paramMeta.paramLocation === PARAMETER_LOCATION.BODY ? 'Configure body parameters' : 'Configure query parameters'}
      classes={classes}
      value={updatedValue}
      onUpdate={handleUpdate}
      handleEditorClick={handleEditorClick}
      isEndSearchIcon
      isInlineClose
    />
  );
}
