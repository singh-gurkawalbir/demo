import { useState, useCallback, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import DynaText from '../DynaText';
import DynaTableView from './DynaTable';

const useStyles = makeStyles(theme => ({
  camSettingFileParsingWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2, 3),
  },
}));

export default function DynaXMLMapper(props) {
  const classes = useStyles();
  const { onFieldChange, properties = {}, value, id } = props;
  const [path, setPath] = useState(properties.path || '');
  let tableValue;

  if (Array.isArray(value)) {
    tableValue = value;
  } else {
    tableValue = value ? value.value : [];
  }

  const [dynaTableValue, setDynaTableValue] = useState(tableValue);

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

  return (
    <Fragment>
      <DynaText
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
    </Fragment>
  );
}
