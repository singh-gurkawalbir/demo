import { useState, useEffect, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, FormLabel, FormControl } from '@material-ui/core';
import ErroredMessageComponent from './ErroredMessageComponent';
import TrashIcon from '../../icons/TrashIcon';

const useStyles = makeStyles(theme => ({
  container: {
    // border: 'solid 1px',
    // borderColor: theme.palette.text.disabled,
    // backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },

  rowContainer: {
    display: 'flex',
    marginBottom: 6,
  },
  label: {
    marginBottom: 6,
  },
}));

export function KeyValueComponent(props) {
  const {
    value,
    onUpdate,
    label,
    dataTest,
    keyName = 'key',
    valueName = 'value',
    classes,
    showDelete,
    disabled,
  } = props;
  const [values, setValues] = useState([]);
  const [rowInd, setRowInd] = useState(0);
  const [isKey, setIsKey] = useState(true);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, [value]);

  const handleDelete = row => () => {
    const valueTmp = [...values];

    if (valueTmp[row]) {
      valueTmp.splice(row, 1);
      setValues(valueTmp);
      onUpdate(valueTmp);
    }
  };

  const handleUpdate = (row, event, field) => {
    const { value } = event.target;

    if (row !== undefined) {
      values[row][field] = value;
    } else {
      values.push({ [field]: value });
    }

    const removedEmptyValues = values.filter(
      value => value[keyName] || value[valueName]
    );

    setValues(removedEmptyValues);

    setRowInd(
      row !== undefined && row < removedEmptyValues.length
        ? row
        : removedEmptyValues.length - 1
    );
    setIsKey(field === keyName);
    onUpdate(removedEmptyValues);
  };

  const tableData = values ? values.map((r, n) => ({ ...r, row: n })) : [];
  const handleKeyUpdate = row => event => handleUpdate(row, event, keyName);
  const handleValueUpdate = row => event => handleUpdate(row, event, valueName);

  return (
    <FormControl
      disabled={disabled}
      data-test={dataTest}
      className={classes.container}>
      <FormLabel className={classes.label}>{label}</FormLabel>
      <Fragment key={`${rowInd}-${isKey}`}>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.row}>
            <TextField
              disabled={disabled}
              autoFocus={r.row === rowInd && isKey}
              defaultValue={r[keyName]}
              placeholder={keyName}
              variant="filled"
              onChange={handleKeyUpdate(r.row)}
              fullWidth
            />

            <TextField
              disabled={disabled}
              autoFocus={r.row === rowInd && !isKey}
              defaultValue={r[valueName]}
              placeholder={valueName}
              variant="filled"
              onChange={handleValueUpdate(r.row)}
              fullWidth
            />

            {showDelete && (
              <IconButton
                disabled={disabled}
                data-test="deleteKeyValue"
                aria-label="delete"
                onClick={handleDelete(r.row)}>
                <TrashIcon />
              </IconButton>
            )}
          </div>
        ))}
      </Fragment>
      <div key="new" className={classes.rowContainer}>
        <TextField
          disabled={disabled}
          value=""
          label={keyName}
          variant="filled"
          onChange={handleKeyUpdate()}
          fullWidth
        />

        <TextField
          disabled={disabled}
          value=""
          label={valueName}
          variant="filled"
          onChange={handleValueUpdate()}
          fullWidth
        />

        {showDelete && (
          <IconButton data-test="deleteKeyValue" aria-label="delete" disabled>
            <TrashIcon />
          </IconButton>
        )}
      </div>
    </FormControl>
  );
}

export default function DynaKeyValue(props) {
  const { id, onFieldChange } = props;
  const onUpdate = values => {
    onFieldChange(id, values);
  };

  const classes = useStyles();

  return (
    <Fragment>
      <KeyValueComponent
        {...props}
        dataTest={id}
        onUpdate={onUpdate}
        classes={classes}
      />
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}
