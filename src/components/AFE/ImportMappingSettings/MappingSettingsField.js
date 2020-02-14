import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImportMappingSettings from './';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';

const useStyles = makeStyles(theme => ({
  settingIcon: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 *
 * disabled property set to try in case of monitor level access
 * disableEdit set to try if mapping field is not editable
 */
export default function MappingSettingsField(props) {
  const classes = useStyles();
  const {
    id,
    onSave,
    extractFields,
    generateFields,
    lookup,
    application,
    updateLookup,
    options,
    value,
    disabled,
    disableEdit,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const isDisabled = !('generate' in value);
  const handleBtnClick = () => {
    if (!isDisabled) setShowSettings(!showSettings);
  };

  const handleClose = (shouldCommit, settings) => {
    if (shouldCommit) {
      onSave(id, settings);
    }

    handleBtnClick();
  };

  return (
    <Fragment>
      {showSettings && (
        <ImportMappingSettings
          application={application}
          open={showSettings}
          updateLookup={updateLookup}
          title="Settings"
          lookup={lookup}
          value={value}
          onClose={handleClose}
          options={options}
          extractFields={extractFields}
          generateFields={generateFields}
          disabled={disabled}
          disableEdit={disableEdit}
        />
      )}

      <ActionButton
        data-test={id}
        className={classes.settingIcon}
        disabled={isDisabled}
        aria-label="settings"
        onClick={handleBtnClick}
        key="settings">
        <SettingsIcon />
      </ActionButton>
    </Fragment>
  );
}
