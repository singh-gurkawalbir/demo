import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ImportMappingSettings from './';

const SettingsIcon = require('../../../components/icons/SettingsIcon').default;

const svgFontSizes = size => ({
  fontSize: size,
  marginRight: 10,
});

export default function MappingSettingsField(props) {
  const {
    id,
    onSave,
    extractFields,
    lookup,
    application,
    updateLookup,
    value,
  } = props;
  const [isSettingsShown, showSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = () => {
    if (!isDisabled) showSettings(!isSettingsShown);
  };

  const handleClose = (shouldCommit, settings) => {
    if (shouldCommit) {
      onSave(id, settings);
    }

    handleBtnClick();
  };

  return (
    <Fragment>
      {isSettingsShown && (
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
        disabled={isDisabled}
        aria-label="delete"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon style={svgFontSizes(24)} />
      </IconButton>
    </Fragment>
  );
}
