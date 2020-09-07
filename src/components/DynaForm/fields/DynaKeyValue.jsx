import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel, FormControl } from '@material-ui/core';
import ErroredMessageComponent from './ErroredMessageComponent';
import TrashIcon from '../../icons/TrashIcon';
import AutoSuggest from './DynaAutoSuggest';
import ActionButton from '../../ActionButton';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
  },

  rowContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    marginBottom: 6,
  },
  label: {
    marginBottom: 6,
  },
  dynaField: {
    flex: 1,
  },
  dynaKeyField: {
    marginRight: theme.spacing(0.5),
  },
  dynaValueField: {
    marginLeft: theme.spacing(0.5),
  },
  dynaKeyValueLabelWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

/**
 *
 *
 * const suggestionConfig = {
    keyConfig: {
      suggestions: [{"id": 1}, {"id": 2}],
      labelName: 'id',
      valueName: 'id',
    },
  }
 */
export function KeyValueComponent(props) {
  const {
    value,
    onUpdate,
    label,
    dataTest,
    keyName = 'key',
    valueName = 'value',
    suggestionConfig = {},
    classes,
    showDelete,
    disabled,
  } = props;
  const {
    keyConfig: suggestKeyConfig,
    valueConfig: suggestValueConfig,
  } = suggestionConfig;
  const [values, setValues] = useState([]);
  const [rowInd, setRowInd] = useState(0);
  const [isKey, setIsKey] = useState(true);

  useEffect(() => {
    // value can be empty/undefined also, so updating the state with the same
    setValues(value || []);
  }, [value]);

  const handleDelete = row => () => {
    if (values[row]) {
      const valueTmp = [...values];

      valueTmp.splice(row, 1);
      setValues(valueTmp);
      onUpdate(valueTmp);
    }
  };

  const handleUpdate = (row, value, field) => {
    if (values[row] !== undefined) {
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

  const tableData = useMemo(() => [
    ...(Array.isArray(values) ? values : []),
    { extract: '', generate: ''},
  ], [values]);

  const handleKeyUpdate = row => event => {
    const { value } = event.target;

    handleUpdate(row, value, keyName);
  };

  const handleValueUpdate = row => event => {
    const { value } = event.target;

    handleUpdate(row, value, valueName);
  };

  return (
    <FormControl
      disabled={disabled}
      data-test={dataTest}
      className={classes.container}>
      <div className={classes.dynaKeyValueLabelWrapper}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <>
        {tableData.map((r, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={classes.rowContainer} key={`${r[keyName]}-${r[valueName]}-${index}`}>
            {suggestKeyConfig && (
              <AutoSuggest
                disabled={disabled}
                value={r[keyName]}
                id={`${keyName}-${index}`}
                data-test={`${keyName}-${index}`}
                // autoFocus={index === rowInd && isKey}
                placeholder={keyName}
                variant="filled"
                onFieldChange={(_, _value) =>
                  handleUpdate(index, _value, keyName)}
                labelName={suggestKeyConfig.labelName}
                valueName={suggestKeyConfig.valueName}
                options={{ suggestions: suggestKeyConfig.suggestions }}
                fullWidth
              />
            )}
            {!suggestKeyConfig && (
              <TextField
                disabled={disabled}
                autoFocus={index === rowInd && isKey}
                defaultValue={r[keyName]}
                id={`${keyName}-${index}`}
                data-test={`${keyName}-${index}`}
                placeholder={keyName}
                variant="filled"
                fullWidth
                onChange={handleKeyUpdate(index)}
                className={clsx(classes.dynaField, classes.dynaKeyField)}
              />
            )}

            {suggestValueConfig && (
              <AutoSuggest
                disabled={disabled}
                value={r[valueName]}
                id={`${valueName}-${index}`}
                data-test={`${valueName}-${index}`}
                // autoFocus={index === rowInd && isKey}
                placeholder={valueName}
                variant="filled"
                labelName={suggestValueConfig.labelName}
                valueName={suggestValueConfig.valueName}
                onFieldChange={(_, _value) =>
                  handleUpdate(index, _value, valueName)}
                options={{ suggestions: suggestValueConfig.suggestions }}
                fullWidth
              />
            )}
            {!suggestValueConfig && (
              <TextField
                disabled={disabled}
                autoFocus={index === rowInd && !isKey}
                id={`${valueName}-${index}`}
                data-test={`${valueName}-${index}`}
                defaultValue={r[valueName]}
                placeholder={valueName}
                variant="filled"
                fullWidth
                onChange={handleValueUpdate(index)}
                className={clsx(classes.dynaField, classes.dynaValueField)}
              />
            )}

            {showDelete && (
              <ActionButton
                disabled={disabled}
                id={`delete-${index}`}
                data-test={`delete-${index}`}
                onClick={handleDelete(index)}>
                <TrashIcon />
              </ActionButton>
            )}
          </div>
        ))}
      </>
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
    <>
      <KeyValueComponent
        {...props}
        dataTest={id}
        onUpdate={onUpdate}
        classes={classes}
      />
      <ErroredMessageComponent {...props} />
    </>
  );
}
