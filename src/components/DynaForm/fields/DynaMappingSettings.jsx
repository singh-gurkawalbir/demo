import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ImportMappingSettings from '../../../components/AFE/ImportMappingSettings';

const SettingsIcon = require('../../../components/icons/SettingsIcon').default;

const svgFontSizes = size => ({
  fontSize: size,
  marginRight: 10,
});

export default function DynaMappingSettings(props) {
  const {
    id,
    onSave,
    extractFields,
    lookup,
    application,
    updateLookup,
    value,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, settings) => {
    if (shouldCommit) {
      onSave(id, settings);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <ImportMappingSettings
          id={id}
          application={application}
          updateLookup={updateLookup}
          title="Settings"
          lookup={lookup}
          value={value}
          onClose={handleClose}
          extractFields={extractFields}
        />
      )}
      <IconButton
        aria-label="delete"
        onClick={handleEditorClick}
        key="settings">
        <SettingsIcon style={svgFontSizes(24)} />
      </IconButton>
    </Fragment>
  );
}
