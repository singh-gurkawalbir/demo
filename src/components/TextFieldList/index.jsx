// import clsx from 'clsx';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Input, InputLabel } from '@material-ui/core';
import shortid from 'shortid';
import TrashIcon from '../icons/TrashIcon';
import ActionButton from '../ActionButton';
import FieldHelp from '../DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(0.5),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  rowContainer: {
    display: 'flex',
  },
  labelWithHelpTextWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
    minWidth: 100,
  },
}));

const addEmptyLastRowIfNotExist = rows => {
  if (rows.length === 0) return [{ key: shortid.generate() }];

  const lastRow = rows[rows.length - 1];

  if (!lastRow.value) return rows;

  return [...rows, { key: shortid.generate() }];
};

const getRowsFromValues = values => {
  const rows = (values || []).map(value => ({value, key: shortid.generate()}));

  return addEmptyLastRowIfNotExist(rows);
};

const getValuesFromRows = rows => rows
  .map(r => r.value)
  .filter(v => !!v);

export default function TextFieldList({ label, disabled, value, onChange, className, helpKey}) {
  const classes = useStyles();
  const [rows, setRows] = useState(getRowsFromValues(value));

  const handleDelete = key => {
    const newRows = [...rows];
    const index = rows.findIndex(r => r.key === key);

    if (rows[index]) {
      newRows.splice(index, 1);
      setRows(newRows);
      onChange(getValuesFromRows(newRows));
    }
  };

  const handleUpdate = (key, value) => {
    let newRows = [...rows];
    const row = rows.findIndex(item => item.key === key);

    newRows[row].value = value;
    newRows = newRows.filter(r => !!r.value);

    setRows(addEmptyLastRowIfNotExist(newRows));
    onChange(getValuesFromRows(newRows));
  };

  return (
    <div className={className}>
      <div className={classes.labelWithHelpTextWrapper}>
        <InputLabel>{label}</InputLabel>
        <FieldHelp helpKey={helpKey} />
      </div>
      {rows.map(({key, value}, index) => (
        <div className={classes.rowContainer} key={key}>
          <Input
            disabled={disabled}
            // autoFocus={index === rowInd && isKey}
            value={value || ''}
            data-test={`value-${index}`}
            // placeholder=""
            variant="filled"
            fullWidth
            onChange={e => handleUpdate(key, e.target.value)}
            className={classes.input}
            />

          <ActionButton
            disabled={disabled || !(value)}
            data-test={`delete-${index}`}
            onClick={() => handleDelete(key)}>
            <TrashIcon />
          </ActionButton>
        </div>
      ))}
    </div>
  );
}
