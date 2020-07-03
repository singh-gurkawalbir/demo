import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

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
  } = props;
  const query = value && value.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const [queryChanged, setQueryChanged] = useState(true);
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/soql/query/metadata`;
  const { data = {} } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey,
    })
  );

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
