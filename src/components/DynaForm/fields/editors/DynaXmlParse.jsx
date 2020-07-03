/* eslint-disable camelcase */ // V0_json is a schema field. cant change.
import React, { useState, useCallback } from 'react';
import { makeStyles, Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import XmlParseEditorDialog from '../../../AFE/XmlParseEditor/Dialog';
import DynaForm from '../..';
import FieldHelp from '../../FieldHelp';

const getParserValue = ({
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
    stripNewLineChars
  };

  if (attributePrefix) rules.attributePrefix = attributePrefix;
  if (textNodeName) rules.textNodeName = textNodeName;
  if (listNodes) rules.listNodes = listNodes.split('\n');
  if (includeNodes) rules.includeNodes = includeNodes.split('\n');
  if (excludeNodes) rules.excludeNodes = excludeNodes.split('\n');

  return [
    {
      type: 'xml',
      version: 1,
      rules
    },
  ];
};

const visibleWhen = [{ field: 'V0_json', is: ['false'] }];
const getForm = options => ({
  fieldMap: {
    V0_json: {
      id: 'V0_json',
      name: 'V0_json',
      type: 'radiogroup',
      label: 'Parse strategy',
      helpText: `Automatic parsing means the XML data is converted to JSON without any user configurations.
        This typically generates a more complex and difficult to read JSON.
        If you would like to have more control over what the JSON output looks like,
        use the custom option.`,
      defaultValue: options?.V0_json ? 'true' : 'false',
      options: [
        {
          items: [
            { value: 'false', label: 'Custom' },
            { value: 'true', label: 'Automatic' },
          ]
        }
      ]
    },
    trimSpaces: {
      id: 'trimSpaces',
      name: 'trimSpaces',
      type: 'checkbox',
      defaultValue: !!options?.trimSpaces,
      helpText: 'If checked, values will be stripped of leading and trailing whitespace.',
      label: 'Trim leading and trailing spaces',
      visibleWhen,
    },
    stripNewLineChars: {
      id: 'stripNewLineChars',
      name: 'stripNewLineChars',
      type: 'checkbox',
      defaultValue: !!options?.stripNewLineChars,
      label: 'Strip new line characters',
      visibleWhen,
    },
    attributePrefix: {
      id: 'attributePrefix',
      name: 'attributePrefix',
      type: 'text',
      placeholder: 'none',
      defaultValue: options?.attributePrefix || '',
      label: 'Character to prepend on attribute names',
      visibleWhen,
    },
    textNodeName: {
      id: 'textNodeName',
      name: 'textNodeName',
      type: 'text',
      placeholder: '&txt',
      defaultValue: options?.textNodeName || '',
      label: 'Text node name',
      visibleWhen,
    },
    listNodes: {
      id: 'listNodes',
      name: 'listNodes',
      type: 'text',
      defaultValue: options?.listNodes || '',
      multiline: true,
      helpText: 'It is not always possible to infer which XML nodes are single values or a list. To force an XML node to be recognized as a list (Array), enter it\'s path here.',
      label: 'List nodes',
      visibleWhen
    },
    includeNodes: {
      id: 'includeNodes',
      name: 'includeNodes',
      type: 'text',
      placeholder: 'all',
      defaultValue: options?.includeNodes || '',
      multiline: true,
      helpText: 'Often XML documents are large and their full content is not needed. It is possibly to reduce the record size by specifying only the set of nodes (specified by path) that should be extracted.',
      label: 'Include only these nodes',
      visibleWhen
    },
    excludeNodes: {
      id: 'excludeNodes',
      name: 'excludeNodes',
      type: 'text',
      placeholder: 'none',
      defaultValue: options?.excludeNodes || '',
      multiline: true,
      helpText: 'It may be easier to specify node to exclude than which to include. If you wish to exclude certain xml nodes from the final record, specify them here using a simplified xpath.',
      label: 'Exclude any of these nodes',
      visibleWhen
    },
  }
});

const useStyles = makeStyles(theme => ({
  fullWidth: {
    width: '100%',
  },
  launchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing(0.5),
  },
  label: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },

}));

export default function DynaXmlParse({
  id,
  value,
  onFieldChange,
  resourceId,
  resourceType,
  disabled,
}) {
  const classes = useStyles();
  const options = value?.[0]?.rules;
  const [currentOptions, setCurrentOptions] = useState(options);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(getForm(options));
  const [formKey, setFormKey] = useState(1);
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);

  // const dispatch = useDispatch();

  // Fetches Raw data - file to be parsed based on the rules
  const data = useSelector(state => {
    const { data, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.resource(state, resourceType, resourceId);

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (resource?.file?.type === 'xml') {
        return resource.sampleData;
      }
    }

    return data?.body;
  });

  const handleClose = (shouldCommit, editorValues = {}) => {
    // console.log(editorValues);

    if (shouldCommit) {
      setForm(getForm(editorValues));
      setFormKey(formKey + 1);
    }

    setShowEditor(false);
  };

  const handleOptionsChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions({...newOptions, V0_json: newOptions.V0_json === 'true'});
      // console.log('optionsChange', newOptions);
      const parsersValue = getParserValue(newOptions);
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true });
      } else {
        onFieldChange(id, parsersValue);
      }
    },
    [id, onFieldChange]
  );

  return (
    <div className={classes.fullWidth}>
      {showEditor && (
        <XmlParseEditorDialog
          title="XML parser helper"
          id={id + resourceId}
          data={data}
          resourceType={resourceType}
          rule={currentOptions}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <div className={classes.launchContainer}>
        <FormLabel className={classes.label}>XML parser helper</FormLabel>
        <Button
          data-test={`parse-helper-${id}`}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleEditorClick}>
          Launch
        </Button>
        <FieldHelp label="Live parser" helpText="The live parser will give you immediate feedback on how your parse options are applied against your raw XML data." />
      </div>
      <DynaForm
        key={formKey}
        onChange={handleOptionsChange}
        disabled={disabled}
        fieldMeta={form}
      />
    </div>
  );
}
