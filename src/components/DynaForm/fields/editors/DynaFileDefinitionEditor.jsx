import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { FormContext } from 'react-forms-processor/dist';
import FileDefinitionEditorDialog from '../../../AFE/FileDefinitionEditor/Dialog';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import {
  FILE_GENERATOR,
  FILE_PARSER,
} from '../../../AFE/FileDefinitionEditor/constants';

/*
 * This editor is shown in case of :
 *  1. In Export creation , when specific format is selected to fetch parser rules
 *  2. When editing an export, resource has a userDefinitionId using which we get rules
 *    customized and saved by user while creation
 */

function DynaFileDefinitionEditor(props) {
  const {
    id,
    label,
    resourceId,
    resourceType,
    onFieldChange,
    formContext,
    userDefinitionId,
    options = {},
    value,
    disabled,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const [isRuleChanged, setIsRuleChanged] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const parserType =
    resourceType === 'imports'
      ? 'fileDefinitionGenerator'
      : 'fileDefinitionParser';
  const processor = resourceType === 'imports' ? FILE_GENERATOR : FILE_PARSER;
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { data, rule } = editorValues;

      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse csv file
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: parserType,
            file: data,
            editorValues,
            formValues: formContext.value,
          },
          'file'
        )
      );

      // update rules against this field each time it gets saved
      if (rule) {
        onFieldChange(id, rule);
      }
    }

    setShowEditor(false);
  };

  const { format, definitionId, resourcePath } = options;
  /*
   * Definition rules are fetched in 2 ways
   * 1. In creation of an export, from FileDefinitions list based on 'definitionId' and 'format'
   * 2. In Editing an existing export, from UserSupportedFileDefinitions based on userDefinitionId
   */
  const { sampleData, rule } = useSelector(state => {
    let template;

    if (definitionId && format) {
      template = selectors.getFileDefinition(state, definitionId, {
        format,
        resourceType,
      });
    } else if (userDefinitionId) {
      // selector to get that resource based on userDefId
      template = selectors.resource(state, 'filedefinitions', userDefinitionId);
    }

    if (!template) return {};
    const { sampleData, ...fileDefinitionRules } = template;
    // Stringify rules as the editor expects a string
    let rule;
    let formattedSampleData;

    if (resourceType === 'imports') {
      rule = JSON.stringify(fileDefinitionRules, null, 2);
      formattedSampleData = JSON.stringify(
        Array.isArray(sampleData) && sampleData.length ? sampleData[0] : {},
        null,
        2
      );
    } else {
      rule = JSON.stringify(
        {
          resourcePath: resourcePath || '',
          fileDefinition: fileDefinitionRules,
        },
        null,
        2
      );
      formattedSampleData = sampleData;
    }

    return { sampleData: formattedSampleData, rule };
  });

  useEffect(() => {
    if (isRuleChanged) {
      onFieldChange(id, rule);
      // Processes the updated sample data and rules on change of format
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: parserType,
            file: sampleData,
            editorValues: { rule, data: sampleData },
            formValues: formContext.value,
          },
          'file'
        )
      );
      setIsRuleChanged(false);
    }
  }, [
    dispatch,
    formContext.value,
    id,
    isRuleChanged,
    onFieldChange,
    parserType,
    resourceId,
    resourceType,
    rule,
    sampleData,
  ]);
  useEffect(() => {
    if (rule) {
      setIsRuleChanged(true);
    }
  }, [rule]);

  return (
    <Fragment>
      <LoadResources resources="filedefinitions">
        {showEditor && (
          <FileDefinitionEditorDialog
            title="File Definition Editor"
            id={id + resourceId}
            processor={processor}
            data={sampleData}
            rule={value}
            onClose={handleClose}
            disabled={disabled}
          />
        )}
        <Button variant="contained" onClick={handleEditorClick}>
          {label}
        </Button>
      </LoadResources>
    </Fragment>
  );
}

const DynaFileDefinitionEditorWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaFileDefinitionEditor {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaFileDefinitionEditorWithFormContext;
