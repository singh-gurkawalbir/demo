import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import BuildOutlined from '@material-ui/icons/BuildOutlined';
import ImportMappingSettingsDialog from '../../../components/AFE/ImportMappingSettings/Dialog';

export default function DynaMappingSettings(props) {
  const { id, onSave, value } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      onSave(id, editorValues);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <ImportMappingSettingsDialog
          title="Settings"
          value={value}
          onClose={handleClose}
        />
      )}
      <IconButton
        aria-label="delete"
        onClick={handleEditorClick}
        key="settings">
        <BuildOutlined fontSize="small" />
      </IconButton>
    </Fragment>
  );
}
