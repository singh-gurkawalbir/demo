import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import RestImportMappingEditor from '../../../components/AFE/RestImportMapping';
// import RestImportMappingDialog from '../../../components/AFE/ImportMappingSettings/Dialog';

export default function DynaRestMapping(props) {
  const { id, onFieldChange, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <RestImportMappingEditor
          title="Define Import Mapping"
          id={id}
          onFieldChange={onFieldChange}
          onClose={handleClose}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
