import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel, FormControl } from '@material-ui/core';
import shortid from 'shortid';
import { isEqual } from 'lodash';
import FieldMessage from './FieldMessage';
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

  const preUpdate = useCallback(val => val.filter(
    val => val[keyName] || val[valueName]
  ).map(({key, ...rest}) => (rest)), [keyName, valueName]);
  const addEmptyLastRowIfNotExist = useCallback(val => {
    const lastRow = val[val.length - 1];

    if (lastRow) {
      const isLastRowEmpty = !(lastRow[keyName] || lastRow[valueName]);

      if (isLastRowEmpty) {
        return val;
      }
    }

    return [...val, {key: shortid.generate()}];
  }, [keyName, valueName]);
  const getInitVal = useCallback(
    () => {
      const formattedValue = (value || []).map(val => ({...val, key: shortid.generate()}));

      return addEmptyLastRowIfNotExist(formattedValue);
    },
    [addEmptyLastRowIfNotExist, value],
  );
  const [values, setValues] = useState(getInitVal());
  const [rowInd, setRowInd] = useState(0);
  const [isKey, setIsKey] = useState(true);

  useEffect(() => {
    // set state in case of lazy loading or value changed by parent
    if (!isEqual(preUpdate(values), (value || []))) {
      setValues(getInitVal());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInitVal, preUpdate, value]);

  const handleDelete = key => () => {
    const valueTmp = [...values];
    const row = valueTmp.findIndex(item => item.key === key);

    if (valueTmp[row]) {
      valueTmp.splice(row, 1);
      setValues(addEmptyLastRowIfNotExist(valueTmp));
      onUpdate(preUpdate(valueTmp));
    }
  };

  const handleUpdate = useCallback((key, value, field) => {
    const valuesCopy = [...values];
    let row;

    if (key) {
      row = values.findIndex(item => item.key === key);

      valuesCopy[row][field] = value;
    } else {
      valuesCopy.push({ [field]: value, key: shortid.generate() });
    }

    const removedEmptyValues = valuesCopy.filter(
      value => value[keyName] || value[valueName]
    );
    const lastRow = valuesCopy[valuesCopy.length - 1];
    const isLastRowEmpty = !(lastRow[keyName] || lastRow[valueName]);

    if (isLastRowEmpty) {
      setValues([...removedEmptyValues, lastRow]);
    } else {
      setValues(addEmptyLastRowIfNotExist(removedEmptyValues));
    }

    setRowInd(
      row !== undefined && row < removedEmptyValues.length
        ? row
        : removedEmptyValues.length - 1
    );
    setIsKey(field === keyName);
    onUpdate(preUpdate(removedEmptyValues));
  }, [addEmptyLastRowIfNotExist, keyName, onUpdate, preUpdate, valueName, values]);

  const handleKeyUpdate = key => event => {
    const { value } = event.target;

    handleUpdate(key, value, keyName);
  };

  const handleValueUpdate = key => event => {
    const { value } = event.target;

    handleUpdate(key, value, valueName);
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
        {values.map((r, index) => (
          <div className={classes.rowContainer} key={r.key}>
            {suggestKeyConfig && (
              <AutoSuggest
                disabled={disabled}
                value={r[keyName]}
                id={`${keyName}-${index}`}
                data-test={`${keyName}-${index}`}
                // autoFocus={r.row === rowInd && isKey}
                placeholder={keyName}
                variant="filled"
                onFieldChange={(_, _value) =>
                  handleUpdate(r.key, _value, keyName)}
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
                onChange={handleKeyUpdate(r.key)}
                className={clsx(classes.dynaField, classes.dynaKeyField)}
              />
            )}

            {suggestValueConfig && (
              <AutoSuggest
                disabled={disabled}
                value={r[valueName]}
                id={`${valueName}-${index}`}
                data-test={`${valueName}-${index}`}
                // autoFocus={r.row === rowInd && isKey}
                placeholder={valueName}
                variant="filled"
                labelName={suggestValueConfig.labelName}
                valueName={suggestValueConfig.valueName}
                onFieldChange={(_, _value) =>
                  handleUpdate(r.key, _value, valueName)}
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
                onChange={handleValueUpdate(r.key)}
                className={clsx(classes.dynaField, classes.dynaValueField)}
              />
            )}

            {showDelete && (
              <ActionButton
                disabled={disabled || (!(r[keyName] || r[valueName]))}
                id={`delete-${index}`}
                data-test={`delete-${index}`}
                onClick={handleDelete(r.key)}>
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
      <FieldMessage {...props} />
    </>
  );
}

