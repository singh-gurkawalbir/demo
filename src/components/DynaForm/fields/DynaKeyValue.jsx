import { useState, useEffect, Fragment } from 'react';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, FormControl, FormLabel } from '@material-ui/core';
import ErroredMessageComponent from './ErroredMessageComponent';
import CloseIcon from '../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  container: {
    // border: 'solid 1px',
    // borderColor: theme.palette.text.disabled,
    // backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
  },
  label: {
    fontSize: '12px',
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
    <div data-test={dataTest} className={classes.container}>
      <FormLabel className={classes.label}>{label}</FormLabel>
      <Fragment key={`${rowInd}-${isKey}`}>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.row}>
            <FormControl>
              <Input
                autoFocus={r.row === rowInd && isKey}
                defaultValue={r[keyName]}
                placeholder={keyName}
                className={classes.input}
                onChange={handleKeyUpdate(r.row)}
              />
            </FormControl>
            <FormControl>
              <Input
                autoFocus={r.row === rowInd && !isKey}
                defaultValue={r[valueName]}
                placeholder={valueName}
                className={classes.input}
                onChange={handleValueUpdate(r.row)}
              />
            </FormControl>
            {showDelete && (
              <IconButton
                data-test="deleteKeyValue"
                aria-label="delete"
                onClick={handleDelete(r.row)}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        ))}
      </Fragment>
      <div key="new" className={classes.rowContainer}>
        <Input
          value=""
          placeholder={keyName}
          className={classes.input}
          onChange={handleKeyUpdate()}
        />
        <Input
          value=""
          placeholder={valueName}
          className={classes.input}
          onChange={handleValueUpdate()}
        />
        {showDelete && (
          <IconButton data-test="deleteKeyValue" aria-label="delete" disabled>
            <CloseIcon />
          </IconButton>
        )}
      </div>
    </div>
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
