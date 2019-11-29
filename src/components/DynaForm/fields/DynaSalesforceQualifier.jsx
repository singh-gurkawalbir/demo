import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import SalesforceEditorDialog from '../../AFE/SalesforceQualificationCriteriaEditor';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaSalesforceQualifier(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    const { rule } = editorValues;

    if (shouldCommit) {
      onFieldChange(id, rule);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <SalesforceEditorDialog
          title="Qualification Criteria"
          id={id}
          value={value}
          resourceId={resourceId}
          flowId={flowId}
          onClose={handleClose}
          disabled={disabled}
          options={options}
        />
      )}
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButton}>
        <ExitIcon />
      </ActionButton>
      <TextField
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? '' : errorMessages}
        disabled
        required={required}
        error={!isValid}
        value={value}
        variant="filled"
      />
    </Fragment>
  );
}
