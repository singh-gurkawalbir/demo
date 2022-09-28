import React, { useMemo, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { KeyValueComponent } from '../DynaKeyValue';
import actions from '../../../../actions';
import { getValidRelativePath } from '../../../../utils/routePaths';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { isMetaRequiredValuesMet, PARAMETER_LOCATION } from '../../../../utils/assistant';

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
    width: `calc(100% - ${theme.spacing(2)}px)`,
  },
}));

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
    keyName,
    valueName,
    required,
  } = props;
  let { label } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const updatedValue = [];

  const editorId = getValidRelativePath(id);
  const flowDataStage = resourceType === 'exports' ? 'inputFilter' : 'importMappingExtract';
  const isMetaValid = isMetaRequiredValuesMet(paramMeta, value);

  Object.keys(value).forEach(key => updatedValue.push({
    name: key,
    value: value[key],
  }));
  const dataFields = useMemo(() =>
    paramMeta.fields.map(({id, description}) => ({
      name: <KeyLabel id={id} description={description} />,
      value: id,
    })), [paramMeta.fields]);
  const suggestionConfig = useMemo(() => ({
    keyConfig: {
      suggestions: dataFields,
      labelName: 'name',
      valueName: 'value',
      showAllSuggestions: true,
    },
  }), [dataFields]);

  useEffect(() => {
    if (!required) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    dispatch(actions.form.forceFieldState(formKey)(id, {isValid: isMetaValid}));
  }, [dispatch, formKey, id, isMetaValid, required]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  const handleSave = useCallback(editorValues => {
    onFieldChange(id, editorValues.rule);
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: flowDataStage,
      onSave: handleSave,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, flowDataStage, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, history, match.url]);

  const handleUpdate = useCallback(values => {
    const finalValue = values.reduce((fv, val) => {
      if (!val[keyName]) {
        return fv;
      }

      return { ...fv, [val[keyName]]: val[valueName]};
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
    />
  );
}
