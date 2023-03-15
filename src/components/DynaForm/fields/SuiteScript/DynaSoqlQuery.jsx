import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

const useStyles = makeStyles({
  dynaFieldWrapper: {
    width: '100%',
  },
  formField: {
    width: '100%',
  },
});

export default function DynaSoqlQuery(props) {
  const {
    id,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
    connectionId,
    multiline,
    filterKey,
    ssLinkedConnectionId,
    isLoggable,
  } = props;
  const query = value && value.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const [queryChanged, setQueryChanged] = useState(true);
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/soql/query/metadata`;

  const { data = {} } = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId, commMetaPath, filterKey);

  const handleFieldOnBlur = () => {
    setsObject(true);
  };

  const handleFieldChange = e => {
    onFieldChange(id, { ...value, query: e.target.value });
    setsObject(false);
    setQueryChanged(true);
  };

  useEffect(() => {
    if (query && sObject && queryChanged) {
      dispatch(
        actions.metadata.request(ssLinkedConnectionId, commMetaPath, { query })
      );
      setSoqlQuery(true);
      setsObject(false);
      setQueryChanged(false);
    }
  }, [
    commMetaPath,
    connectionId,
    dispatch,
    query,
    queryChanged,
    sObject,
    ssLinkedConnectionId,
  ]);
  useEffect(() => {
    if (soqlQuery && data.entityName) {
      onFieldChange(id, { ...value, entityName: data.entityName }, true);
      dispatch(
        actions.metadata.request(
          ssLinkedConnectionId,
          `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${data.entityName}?ignoreCache=true`
        )
      );
      setSoqlQuery(false);
    }
  }, [
    connectionId,
    data.entityName,
    dispatch,
    id,
    onFieldChange,
    soqlQuery,
    ssLinkedConnectionId,
    value,
  ]);

  return (
    <div className={classes.dynaFieldWrapper}>
      <TextField
        {...isLoggableAttr(isLoggable)}
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        label={label}
        placeholder={placeholder}
        multiline={multiline}
        required={required}
        value={value.query}
        variant="filled"
        onBlur={handleFieldOnBlur}
        className={classes.formField}
        onChange={handleFieldChange}
      />
    </div>
  );
}
