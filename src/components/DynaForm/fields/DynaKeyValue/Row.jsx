import { TextField, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { isArray } from 'lodash';
import TrashIcon from '../../../icons/TrashIcon';
import AutoSuggest from '../DynaAutoSuggest';
import MultiSelect from '../DynaMultiSelect';
import ActionButton from '../../../ActionButton';
import SortableHandle from '../../../Sortable/SortableHandle';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import CeligoSelect from '../../../CeligoSelect';
import AfeIcon from '../../../icons/AfeIcon';
import CloseIcon from '../../../icons/CloseIcon';
import FieldHelp from '../../FieldHelp';

const emptySet = {};

const RemoveButton = ({icon, index, disabled, r, keyName, valueName, handleDelete}) => (
  <ActionButton
    disabled={disabled || (!(r[keyName] || r[valueName]))}
    id={`delete-${index}`}
    data-test={`delete-${index}`}
    tooltip="Delete"
    onClick={handleDelete(r.key)}>
    {icon}
  </ActionButton>
);

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
    keyPlaceholder,
  } = props;

  const {
    keyConfig: suggestKeyConfig,
    valueConfig: suggestValueConfig,
  } = suggestionConfig;
  const showMultiSelectValue = r.isMultiSelect && (!r[valueName] || isArray(r[valueName]) || r.options.find(({value}) => value === r[valueName]));
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
  const dataFields = useMemo(() => props?.paramMeta?.fields.reduce((dataMap, {id, description}) => ({...dataMap, [id]: description}), {}), [props?.paramMeta?.fields]);

  const closeComponent = isInlineClose ? (
    <RemoveButton
      icon={<CloseIcon />} index={index} disabled={disabled} r={r}
      keyName={keyName}
      valueName={valueName} handleDelete={handleDelete} />
  ) : undefined;

  return (
    <div
      {...isLoggableAttr(isLoggable)}
      className={rowComponentClasses.rowWrapper}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {enableSorting && (<SortableHandle isVisible={showGripper} />)}
      <div className={clsx(classes.rowContainer, rowComponentClasses.textFieldRowContainer, {[rowComponentClasses.rowContainerWrapper]: !suggestKeyConfig && !suggestValueConfig})}>
        {suggestKeyConfig && (
        <AutoSuggest
          disabled={r.disableRowKey || disabled}
          value={r[keyName]}
          id={`${keyName}-${index}`}
          data-test={`${keyName}-${index}`}
          autoFocus={index === rowInd && isKey && dataFields && !dataFields[r[keyName]]}
          placeholder={keyPlaceholder || keyName}
          variant="filled"
          onFieldChange={(_, _value) =>
            handleUpdate(r.key, _value, keyName)}
          labelName={suggestKeyConfig.labelName}
          valueName={suggestKeyConfig.valueName}
          options={{ suggestions: suggestKeyConfig.suggestions }}
          showAllSuggestions={suggestKeyConfig.showAllSuggestions}
          fullWidth
          isEndSearchIcon={isEndSearchIcon}
          showInlineClose={!r.disableRowKey ? closeComponent : <ActionButton><FieldHelp title={r.name} helpText={dataFields[r.name]} /></ActionButton>}
          />

        )}
        {!suggestKeyConfig && (
        <TextField
          disabled={r.disableRowKey || disabled}
          autoFocus={index === rowInd && isKey}
          defaultValue={r[keyName]}
          id={`${keyName}-${index}`}
          data-test={`${keyName}-${index}`}
          placeholder={keyPlaceholder || keyName}
          variant="filled"
          fullWidth
          onChange={handleKeyUpdate(r.key)}
          className={clsx(classes.dynaField, classes.dynaKeyField)}
              />
        )}

        { (r.isSelect || suggestValueConfig) && !showSortOrder && (
        <div className={r.isSelect ? clsx(classes.dynaField, classes.dynaValueField) : ''}>
          <AutoSuggest
            disabled={disabled}
            value={r[valueName]}
            id={`${valueName}-${index}`}
            data-test={`${valueName}-${index}`}
                // autoFocus={r.row === rowInd && isKey}
            placeholder={valueName}
            variant="filled"
            labelName={r.isSelect ? 'name' : suggestValueConfig.labelName}
            valueName={r.isSelect ? 'value' : suggestValueConfig.valueName}
            onFieldChange={(_, _value) =>
              handleUpdate(r.key, _value, valueName)}
            options={r.isSelect ? {suggestions: r.options} : { suggestions: suggestValueConfig.suggestions }}
            fullWidth
              />
        </div>
        )}
        { showMultiSelectValue && (
        <div className={clsx(classes.dynaField, classes.dynaValueField)}>
          <MultiSelect
            disabled={disabled}
            value={r[valueName]}
            id={`${valueName}-${index}`}
            name={`${valueName}-${index}`}
            onFieldChange={(_, _value) => handleUpdate(r.key, _value, valueName)}
            options={[{ items: r.options || [] }]}
          />
        </div>
        )}
        {!r.isSelect && !showMultiSelectValue && !suggestValueConfig && !showSortOrder && (
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
        <RemoveButton
          icon={<TrashIcon />}
          index={index} disabled={disabled} r={r} keyName={keyName}
          valueName={valueName} handleDelete={handleDelete}
          />
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
