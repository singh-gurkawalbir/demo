import React, { useState, useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import DynaText from '../DynaText';
import DynaTableView from './DynaTable';

const useStyles = makeStyles(theme => ({
  camSettingFileParsingWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2, 3),
  },
}));

const optionsMap = [
  {
    id: 'fieldName',
    label: 'Field Description',
    type: 'input',
    required: true,
    supportsRefresh: false,
  },
  {
    id: 'path',
    label: 'Path',
    required: false,
    type: 'input',
    supportsRefresh: false,
  },
  {
    id: 'regexExpression',
    label: 'Regex',
    required: false,
    type: 'input',
    supportsRefresh: false,
  },
];

const generateTableValue = value => {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? value.value : [];
};

export default function DynaXMLMapper(props) {
  const classes = useStyles();
  const { onFieldChange, properties = {}, value, id, isLoggable } = props;
  const [path, setPath] = useState(properties.path || '');

  const [dynaTableValue, setDynaTableValue] = useState(generateTableValue(value));

  useEffect(() => {
    onFieldChange(id, { path, value: dynaTableValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynaTableValue, id, path]);

  const fieldChangeHandler = useCallback((id1, val) => {
    if (val && Array.isArray(val)) {
      setDynaTableValue(val);
    }
  }, []);
  const handlePathUpdate = useCallback((id2, val) => {
    setPath(val);
  }, []);

  return (
    <>
      <DynaText
        isLoggable={isLoggable}
        value={path}
        label="Path:"
        placeholder="Path"
        margin="normal"
        variant="outlined"
        onFieldChange={handlePathUpdate}
      />
      <DynaTableView
        {...props}
        className={classes.camSettingFileParsingWrapper}
        optionsMap={optionsMap}
        value={dynaTableValue}
        hideLabel
        onFieldChange={fieldChangeHandler}
      />
    </>
  );
}
