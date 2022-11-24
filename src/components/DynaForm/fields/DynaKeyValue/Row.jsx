import { makeStyles, TextField, MenuItem } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import TrashIcon from '../../../icons/TrashIcon';
import AutoSuggest from '../DynaAutoSuggest';
import ActionButton from '../../../ActionButton';
import SortableHandle from '../../../Sortable/SortableHandle';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import CeligoSelect from '../../../CeligoSelect';
import AfeIcon from '../../../icons/AfeIcon';
import CloseIcon from '../../../icons/CloseIcon';

const emptySet = {};

const useStyles = makeStyles(theme => ({
  rowWrapper: {
    display: 'flex',
  },
  textFieldRowContainer: {
    flexGrow: 1,
  },
  rowContainerWrapper: {
    display: 'flex !important',
  },
  dynaURIActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
}));

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
    isInlineClose,
    handleDelete,
    isKey,
    r,
    classes,
    enableSorting,
    showSortOrder,
    isLoggable,
    handleEditorClick,
    isEndSearchIcon,
  } = props;

  const {
    keyConfig: suggestKeyConfig,
    valueConfig: suggestValueConfig,
  } = suggestionConfig;

  const rowComponentClasses = useStyles();
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
  const closeComponent = isInlineClose ? (
    <ActionButton
      disabled={disabled || (!(r[keyName] || r[valueName]))}
      id={`delete-${index}`}
      data-test={`delete-${index}`}
      tooltip="Delete"
      onClick={handleDelete(r.key)}>
      <CloseIcon />
    </ActionButton>
  ) : undefined;

  return (
    <div
      {...isLoggableAttr(isLoggable)}
      className={rowComponentClasses.rowWrapper}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {enableSorting && (
        <SortableHandle isVisible={showGripper} />
      )}
      <div className={clsx(classes.rowContainer, rowComponentClasses.textFieldRowContainer, {[rowComponentClasses.rowContainerWrapper]: !suggestKeyConfig && !suggestValueConfig})}>
        {suggestKeyConfig && (
        <AutoSuggest
          disabled={r.disableRowKey || disabled}
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
          showAllSuggestions={suggestKeyConfig.showAllSuggestions}
          fullWidth
          isEndSearchIcon={isEndSearchIcon}
          showInlineClose={closeComponent}
          />

        )}
        {!suggestKeyConfig && (
        <TextField
          disabled={r.disableRowKey || disabled}
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

        {suggestValueConfig && !showSortOrder && (
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
        {!suggestValueConfig && !showSortOrder && (
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
        {showSortOrder && (
        <CeligoSelect
          disabled={disabled}
          id={`${valueName}-${index}`}
          data-test={`${valueName}-${index}`}
          defaultValue={!!r[valueName]}
          className={clsx(classes.dynaField, classes.dynaValueField)}
          onChange={handleValueUpdate(r.key)}>
          <MenuItem key="ascending" data-test="ascendingSort" value={false}>
            Ascending
          </MenuItem>
          <MenuItem key="descending" data-test="descendingSort" value>
            Descending
          </MenuItem>
        </CeligoSelect>
        )}

        {showDelete && (
        <ActionButton
          disabled={disabled || (!(r[keyName] || r[valueName]))}
          id={`delete-${index}`}
          data-test={`delete-${index}`}
          tooltip="Delete"
          onClick={handleDelete(r.key)}>
          <TrashIcon />
        </ActionButton>
        )}
        {handleEditorClick && (
          <ActionButton
            id={`handleBar-${index}`}
            data-test={`handleBar-${index}`}
            tooltip="Open handlebars editor"
            onClick={handleEditorClick(index)}
            className={classes.dynaURIActionButton}>
            <AfeIcon />
          </ActionButton>
        )}
      </div>
    </div>

  );
}
