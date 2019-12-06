import { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import { isArray } from 'lodash';
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
      } else if (defaultValue) {
        onFieldChange(id, defaultValue);
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
      onFieldChange(id, JSON.stringify(rule));
    }

    handleEditorClick();
  };

  let rule = [];

  if (value) {
    try {
      rule = JSON.parse(value);
    } catch (e) {
      rule = value;
    }
  }

  return (
    <Fragment>
      {showEditor && (
        <NetSuiteQualificationCriteriaEditor
          title="Qualification Criteria"
          id={id}
          value={rule}
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
        value={isArray(value) ? JSON.stringify(value) : value}
        variant="filled"
      />
    </Fragment>
  );
}
