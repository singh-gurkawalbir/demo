/* eslint-disable camelcase */ // V0_json is a schema field. cant change.
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, Button, FormLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import FieldHelp from '../../../FieldHelp';
import getForm from '../../../../AFE2/Editor/panels/XmlParseRules/formMeta';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { isNewId } from '../../../../../utils/resource';
import {useUpdateParentForm} from '../DynaCsvGenerate_afe2';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';
import { getValidRelativePath } from '../../../../../utils/routePaths';
import FileDataChange from '../DynaCsvParse_afe2/FileDataChange';

const getParserValue = ({
  resourcePath,
  V0_json,
  attributePrefix,
  trimSpaces,
  stripNewLineChars,
  textNodeName,
  listNodes,
  includeNodes,
  excludeNodes}) => {
  const rules = {
    V0_json: V0_json === 'true',
    trimSpaces,
    stripNewLineChars,
  };

  if (attributePrefix) rules.attributePrefix = attributePrefix;
  if (textNodeName) rules.textNodeName = textNodeName;
  if (listNodes) rules.listNodes = listNodes;
  if (includeNodes) rules.includeNodes = includeNodes;
  if (excludeNodes) rules.excludeNodes = excludeNodes;

  const value = [
    {
      type: 'xml',
      version: 1,
      rules,
    },
  ];

  // This value is not actually part of the `parsers` schema, but we
  // need to place it somewhere such that the parent form preSave can find
  // it and properly add it to the exports.file.xml.resourcePath schema field.
  value.resourcePath = resourcePath;

  return value;
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    maxWidth: 100,
  },
  label: {
    marginBottom: 6,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaXmlParse_afe2({
  id,
  value,
  onFieldChange,
  resourceId,
  resourceType,
  disabled,
  flowId,
  label,
  formKey: parentFormKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const [remountKey, setRemountKey] = useState(1);

  const resourcePath = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)?.file?.xml?.resourcePath);
  const getInitOptions = useCallback(
    val => ({ resourcePath, ...val?.[0]?.rules}),
    [resourcePath],
  );
  const options = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [form, setForm] = useState(getForm(options, resourceId));

  // below logic would need to move to data-layer as part of tracker IO-17578
  useEffect(() => {
    // corrupted export without parsers object (possibly created in Ampersand). Set the default strategy as 'Automatic'
    if (!isNewId(resourceId) && !options.V0_json && options.V0_json !== false) {
      const patch = [
        {
          op: 'replace',
          path: '/parsers',
          value:
            {
              type: 'xml',
              version: 1,
              rules: {
                V0_json: true,
                stripNewLineChars: false,
                trimSpaces: false,
              },
            },

        }];

      dispatch(actions.resource.patchStaged(resourceId, patch, 'value'));
    }
  }, [options, dispatch, resourceId]);

  const handleSave = useCallback((editorValues = {}) => {
    const { rule } = editorValues;

    const parsersValue = getParserValue(rule);

    // console.log('handleSave: rule, parsed', rule, parsersValue);

    setForm(getForm(rule, resourceId));
    setRemountKey(remountKey => remountKey + 1);
    onFieldChange(id, parsersValue);
  }, [id, onFieldChange, resourceId]);

  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      const parsersValue = getParserValue(newOptions);

      // console.log('dyna xml parse handleFormChange', parsersValue);
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true }, touched);
      } else {
        onFieldChange(id, parsersValue, touched);
      }
    },
    [id, onFieldChange]
  );

  // TODO: @Ashu: Why not just hardcode this sub-form key? I cant think of
  // a case where we would have a collision.
  const parseFormKey = 'xmlParserFields';

  useUpdateParentForm(parseFormKey, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, parseFormKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: parseFormKey,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'xmlParser', {
      formKey: parentFormKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, parentFormKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <div className={classes.container}>
        {/* todo: FileDataChange is a temporary hack until Raghu's changes are
        done re dispatching of SAMPLEDATA_UPDATED action to update editor sample data */}
        <FileDataChange editorId={editorId} fileType="xml" />
        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp label="Live parser" helpText="The live parser will give you immediate feedback on how your parse options are applied against your raw XML data." />
        </div>
        <Button
          data-test={`parse-helper-${id}`}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>

      <DynaForm
        formKey={formKeyComponent}
      />
    </>
  );
}
