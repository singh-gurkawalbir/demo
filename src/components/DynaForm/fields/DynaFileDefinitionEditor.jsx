import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { FormContext } from 'react-forms-processor/dist';
import FileDefinitionEditorDialog from '../../../components/AFE/FileDefinitionEditor/Dialog';
import * as selectors from '../../../reducers';
import actions from '../../../actions';

function DynaFileDefinitionEditor(props) {
  const {
    id,
    label,
    resourceId,
    resourceType,
    onFieldChange,
    formContext,
    options = {},
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { data, rule } = editorValues;

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
      onFieldChange(id, rule);
    }

    setShowEditor(false);
  };

  // It expects selected definition id and File definition format to fetch
  // Parse / Generate rules and sample data for the same based on resource type ( exports/ imports)
  const { format, definitionId, resourcePath } = options;
  const { sampleData, rule } = useSelector(state => {
    const template = selectors.getDefinitionTemplate(
      state,
      format,
      definitionId,
      resourceType
    );
    const { sampleData, ...fileDefinitionRules } = template || {};

    return {
      sampleData,
      rule: {
        resourcePath: resourcePath || '',
        fileDefinition: fileDefinitionRules,
      },
    };
  });

  return (
    <Fragment>
      {showEditor && (
        <FileDefinitionEditorDialog
          title="File Definition Editor"
          id={id + resourceId}
          data={sampleData}
          rule={JSON.stringify(rule)}
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
