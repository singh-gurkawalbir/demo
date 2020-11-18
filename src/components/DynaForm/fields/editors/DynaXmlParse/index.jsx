/* eslint-disable camelcase */ // V0_json is a schema field. cant change.
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, Button, FormLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import XmlParseEditorDrawer from '../../../../AFE/XmlParseEditor/Drawer';
import DynaForm from '../../..';
import DynaUploadFile from '../../DynaUploadFile';
import FieldHelp from '../../../FieldHelp';
import getForm from './formMeta';
import usePushRightDrawer from '../../../../../hooks/usePushRightDrawer';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { generateNewId, isNewId } from '../../../../../utils/resource';
import {useUpdateParentForm} from '../DynaCsvGenerate';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';

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
  if (listNodes) {
    if (typeof listNodes === 'string') {
      rules.listNodes = listNodes.split('\n');
    } else if (Array.isArray(listNodes)) {
      rules.listNodes = listNodes;
    }
  }
  if (includeNodes) {
    if (typeof includeNodes === 'string') {
      rules.includeNodes = includeNodes.split('\n');
    } else if (Array.isArray(includeNodes)) {
      rules.includeNodes = includeNodes;
    }
  }
  if (excludeNodes) {
    if (typeof excludeNodes === 'string') {
      rules.excludeNodes = excludeNodes.split('\n');
    } else if (Array.isArray(excludeNodes)) {
      rules.excludeNodes = excludeNodes;
    }
  }

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
  launchContainer: {
    display: 'flex',
    alignItems: 'center',
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
  fileUploadLabelWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',

  },
  fileUploadRoot: {
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',

  },
  uploadContainer: {
    justifyContent: 'flex-end',
    background: 'transparent !important',
    border: '0px !important',
    width: 'auto !important',
    padding: 4,
  },
  uploadFileErrorContainer: {
    marginBottom: 4,
  },
}));

export default function DynaXmlParse({
  id,
  value,
  onFieldChange,
  resourceId,
  resourceType,
  disabled,
  uploadSampleDataFieldName,
  label,
  formKey: parentFormKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [remountKey, setRemountKey] = useState(1);
  const handleOpenDrawer = usePushRightDrawer(id);
  const resourcePath = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)?.file?.xml?.resourcePath);
  const getInitOptions = useCallback(
    val => ({ resourcePath, ...val?.[0]?.rules}),
    [resourcePath],
  );
  const options = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [form, setForm] = useState(getForm(options, resourceId));
  const [currentOptions, setCurrentOptions] = useState(options);
  const data = useSelector(state =>
    selectors.fileSampleData(state, { resourceId, resourceType, fileType: 'xml'}));

  useEffect(() => {
    // corrupted export without parsers object (possibly created in Ampersand). Set the default strategy as 'Automatic'
    if (!isNewId(resourceId) && !currentOptions.V0_json && currentOptions.V0_json !== false) {
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
  }, [currentOptions, dispatch, resourceId]);

  const handleEditorSave = useCallback((shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      const parsersValue = getParserValue(editorValues);

      setCurrentOptions(getInitOptions(parsersValue));

      setForm(getForm(editorValues, resourceId));
      setRemountKey(remountKey => remountKey + 1);
      onFieldChange(id, parsersValue);
    }
  }, [getInitOptions, id, onFieldChange, resourceId]);

  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      setCurrentOptions({...newOptions, V0_json: newOptions.V0_json === 'true'});
      // console.log('optionsChange', newOptions);
      const parsersValue = getParserValue(newOptions);

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
  const editorDataTitle = useMemo(
    () => {
      if (uploadSampleDataFieldName) {
        return (
          <DynaUploadFile
            resourceId={resourceId}
            resourceType={resourceType}
            onFieldChange={onFieldChange}
            options="xml"
            color=""
            placeholder="Sample XML file (that would be parsed)"
            id={uploadSampleDataFieldName}
            persistData
            hideFileName
            variant="text"
            classProps={
              {
                root: classes.fileUploadRoot,
                labelWrapper: classes.fileUploadLabelWrapper,
                uploadFile: classes.uploadContainer,
                actionContainer: classes.actionContainer,
                errorContainer: classes.uploadFileErrorContainer,
              }
            }
          />
        );
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadSampleDataFieldName]
  );

  const [secondaryFormKey] = useState(generateNewId());

  useUpdateParentForm(secondaryFormKey, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, secondaryFormKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: secondaryFormKey,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  return (
    <>
      <div className={classes.container}>
        <XmlParseEditorDrawer
          title={label}
          id={id + resourceId}
          data={data}
          resourceType={resourceType}
          rule={currentOptions}
          onSave={handleEditorSave}
          disabled={disabled}
          editorDataTitle={editorDataTitle}
          path={id}
        />

        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp label="Live parser" helpText="The live parser will give you immediate feedback on how your parse options are applied against your raw XML data." />
        </div>
        <Button
          data-test={`parse-helper-${id}`}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleOpenDrawer}>
          Launch
        </Button>
      </div>

      <DynaForm
        formKey={formKeyComponent}
        fieldMeta={form}
      />
    </>
  );
}
