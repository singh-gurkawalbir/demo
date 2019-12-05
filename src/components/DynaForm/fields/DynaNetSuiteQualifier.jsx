import { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import OpenInNewIcon from '../../../components/icons/ExitIcon';
import NetSuiteQualificationCriteriaEditor from '../../AFE/NetSuiteQualificationCriteriaEditor';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    float: 'right',
    marginLeft: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function DynaNetSuiteQualifier(props) {
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
    defaultValue,
    value,
    label,
    options,
  } = props;
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);

  useEffect(() => {
    if (options.commMetaPath) {
      setIsDefaultValueChanged(true);
    }
  }, [options.commMetaPath]);

  useEffect(() => {
    if (isDefaultValueChanged) {
      if (options.resetValue) {
        onFieldChange(id, []);
      }

      setIsDefaultValueChanged(false);
    }
  }, [
    defaultValue,
    id,
    isDefaultValueChanged,
    onFieldChange,
    options.resetValue,
  ]);
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
        <NetSuiteQualificationCriteriaEditor
          title="Qualification Criteria"
          id={id}
          value={value}
          onClose={handleClose}
          disabled={disabled}
          options={options}
        />
      )}
      <IconButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <OpenInNewIcon />
      </IconButton>
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
        value={JSON.stringify(value || [])}
        variant="filled"
      />
    </Fragment>
  );
}
