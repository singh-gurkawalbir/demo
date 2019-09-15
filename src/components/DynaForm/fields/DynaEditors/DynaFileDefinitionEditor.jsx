import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { FormContext } from 'react-forms-processor/dist';
import FileDefinitionEditorDialog from '../../../AFE/FileDefinitionEditor/Dialog';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

/*
 * This editor is shown in case of :
 *  1. In Export creation , when specific format is selected to fetch parser rules
 *  2. When editing an export, resource has a userDefinitionId using which we get rules
 *    customized and saved by user while creation
 *  3. So 'hideFileDefinitionEditor' checks if neither of userDefinitionId nor format is selected
 * Rule is always in a String format saved against 'id'
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
  } = props;
  const hideFileDefinitionEditor =
    !userDefinitionId &&
    !formContext.value['/edix12/format'] &&
    !formContext.value['/edifact/format'] &&
    !formContext.value['/fixed/format'];
  const [showEditor, setShowEditor] = useState(false);
  const [isDefaultRuleAssigned, setIsDefaultRuleAssigned] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const { data: userSupportedFileDefinitions, status } = useSelector(state =>
    selectors.getUserSupportedFileDefinitions(state)
  );

  useEffect(() => {
    // !status indicates no request has been made for fetching file defs
    // We make a fetch call to load all userSupportedFileDefinitions

    if (!userSupportedFileDefinitions.length && !status) {
      dispatch(actions.fileDefinitions.userSupported.request());
    }
  }, [dispatch, status, userDefinitionId, userSupportedFileDefinitions.length]);

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
            type: 'fileDefinition',
            file: data,
            rules: rule && JSON.parse(rule),
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
      template = selectors.getFileDefinition(state, userDefinitionId, {
        type: 'user',
      });
    }

    if (!template) return {};
    const { sampleData, ...fileDefinitionRules } = template;
    const rule = {
      resourcePath: resourcePath || '',
      fileDefinition: fileDefinitionRules,
    };

    return { sampleData, rule };
  });

  useEffect(() => {
    if (!isDefaultRuleAssigned && rule && rule.fileDefinition) {
      onFieldChange(id, JSON.stringify(rule, null, 2));
      setIsDefaultRuleAssigned(true);
    }
  }, [id, isDefaultRuleAssigned, onFieldChange, rule]);

  if (hideFileDefinitionEditor) {
    return null;
  }

  return (
    <Fragment>
      {showEditor && (
        <FileDefinitionEditorDialog
          title="File Definition Editor"
          id={id + resourceId}
          data={sampleData}
          // Stringify rules as the editor expects a string
          rule={value || JSON.stringify(rule, null, 2)}
          onClose={handleClose}
        />
      )}
      <Button variant="contained" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}

const DynaFileDefinitionEditorWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaFileDefinitionEditor {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaFileDefinitionEditorWithFormContext;
