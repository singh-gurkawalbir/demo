import { makeStyles, TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import TrashIcon from '../../../icons/TrashIcon';
import AutoSuggest from '../DynaAutoSuggest';
import ActionButton from '../../../ActionButton';
import SortableHandle from '../../../Sortable/SortableHandle';

const emptySet = {};

const useStyles = makeStyles({
  rowWrapper: {
    display: 'flex',
  },
  rowContainer: {
    flexGrow: 1,
  },
});

export default function KeyValueRow(props) {
  const {
    suggestionConfig = emptySet,
    isDragInProgress,
    isRowDragged,
    disabled,
    keyName,
    valueName,
    index,
    handleUpdate,
    rowInd,
    handleKeyUpdate,
    handleValueUpdate,
    showDelete,
    handleDelete,
    isKey,
    r,
    classes,
    enableSorting,
  } = props;
  const {
    keyConfig: suggestKeyConfig,
    valueConfig: suggestValueConfig,
  } = suggestionConfig;
  const compClasses = useStyles();
  const [showGripper, setShowGripper] = useState(false);
  const handleOnMouseEnter = useCallback(() => {
    if (enableSorting && !isDragInProgress) {
      setShowGripper(true);
    }
  }, [enableSorting, isDragInProgress]);
  const handleOnMouseLeave = useCallback(() => {
    if (enableSorting) {
      setShowGripper(false);
    }
  }, [enableSorting]);

  useEffect(() => {
    if (enableSorting && isRowDragged) {
      setShowGripper(true);
    }
  }, [enableSorting, isRowDragged]);

  return (
    <div
      className={compClasses.rowWrapper}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {enableSorting && (
        <SortableHandle isVisible={showGripper} />
      )}
      <div
        className={clsx(classes.rowContainer, compClasses.rowContainer)}
        >
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
    </div>

  );
}
