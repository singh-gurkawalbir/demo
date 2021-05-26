import React, { useState, useCallback, useEffect } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel, FormControl } from '@material-ui/core';
import shortid from 'shortid';
import { isEqual } from 'lodash';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import KeyValueRow from './Row';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  listContainer: {
    marginInlineStart: 0,
    marginBlockStart: 0,
    paddingInlineStart: 0,
    marginBlockEnd: 0,
    listStyleType: 'none',
    '& > li': {
      listStyle: 'none',
    },
  },
  rowContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    marginBottom: 6,
  },
  dragIconWrapper: {
    cursor: 'move',
    background: 'none',
    minWidth: theme.spacing(3.5),
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
  helperClass: {
    listStyleType: 'none',
    zIndex: '999999',
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

const SortableItem = SortableElement(({value}) => (
  <li>
    {value}
  </li>
));

const SortableList = SortableContainer(({children, className}) => <ul className={className}>{children}</ul>);

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
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragIndex: undefined,
  });

  const {isDragging, dragIndex} = dragState;

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

  const handleSortStart = ({ index }) => {
    setDragState({isDragging: true, dragIndex: index});
  };

  const handleSortEnd = useCallback(({oldIndex, newIndex}) => {
    setDragState({isDragging: false, dragIndex: undefined});
    if (oldIndex !== newIndex) {
      // re-order here
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
    }
  }, [addEmptyLastRowIfNotExist, keyName, onUpdate, preUpdate, valueName, values]);

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
          className={classes.listContainer}
          axis="y"
          helperClass={classes.helperClass}
          useDragHandle>
          {values.map((r, index) => {
            const Row = (
              <KeyValueRow
                suggestionConfig={suggestionConfig}
                isDragInProgress={isDragging}
                isRowDragged={dragIndex === index}
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
            );

            if (!r[keyName] && !r[valueName]) {
              return Row;
            }

            return (
              <SortableItem
                key={r.key}
                disabled={!enableSorting}
                index={index}
                hideSortableGhost={false}
                value={Row}
              />
            );
          })};
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

