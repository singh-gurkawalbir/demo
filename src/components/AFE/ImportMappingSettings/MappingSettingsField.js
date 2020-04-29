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
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsField(props) {
  const classes = useStyles();
  const {
    id,
    onSave,
    extractFields,
    generateFields,
    application,
    updateLookup,
    options,
    value,
    disabled,
    isCategoryMapping,
    lookups,
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
          value={value}
          isCategoryMapping={isCategoryMapping}
          onClose={handleClose}
          options={options}
          extractFields={extractFields}
          generateFields={generateFields}
          disabled={disabled}
          lookups={lookups}
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
