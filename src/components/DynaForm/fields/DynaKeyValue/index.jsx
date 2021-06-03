import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel, FormControl } from '@material-ui/core';
import shortid from 'shortid';
import { isEqual } from 'lodash';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import KeyValueRow from './Row';
import SortableList from '../../../Sortable/SortableList';
import SortableItem from '../../../Sortable/SortableItem';
import useSortableList from '../../../../hooks/useSortableList';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  rowContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
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
    enableSorting = false,
  } = props;

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

  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    const valuesCopy = [...values];
    const [removed] = valuesCopy.splice(oldIndex, 1);

    valuesCopy.splice(newIndex, 0, removed);

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
    onUpdate(preUpdate(removedEmptyValues));
  }, [addEmptyLastRowIfNotExist, keyName, onUpdate, preUpdate, valueName, values]);

  const {dragItemIndex, handleSortStart, handleSortEnd} = useSortableList(onSortEnd);

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
        <SortableList
          onSortEnd={handleSortEnd}
          updateBeforeSortStart={handleSortStart}
          axis="y"
          useDragHandle>
          {values.map((r, index) => (
            <SortableItem
              key={r.key}
              disabled={!enableSorting || (!r[keyName] && !r[valueName])}
              index={index}
              hideSortableGhost={false}
              value={(
                <KeyValueRow
                  suggestionConfig={suggestionConfig}
                  isDragInProgress={dragItemIndex !== undefined}
                  isRowDragged={dragItemIndex === index}
                  disabled={disabled}
                  keyName={keyName}
                  valueName={valueName}
                  index={index}
                  handleUpdate={handleUpdate}
                  rowInd={rowInd}
                  handleKeyUpdate={handleKeyUpdate}
                  handleValueUpdate={handleValueUpdate}
                  showDelete={showDelete}
                  handleDelete={handleDelete}
                  isKey={isKey}
                  classes={classes}
                  r={r}
                  enableSorting={enableSorting}
              />
              )}
              />
          ))};
        </SortableList>
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

