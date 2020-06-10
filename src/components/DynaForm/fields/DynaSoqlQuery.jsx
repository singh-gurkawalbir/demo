import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles({
  formField: {
    width: '100%',
  },
  dynasoqlFormControl: {
    width: '100%',
  },
  dynasoqlLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
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
  } = props;
  const query = value && value.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const [queryChanged, setQueryChanged] = useState(true);
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/query/columns`;
  const { data = {} } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
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
      dispatch(actions.metadata.request(connectionId, commMetaPath, { query }));
      setSoqlQuery(true);
      setsObject(false);
      setQueryChanged(false);
    }
  }, [commMetaPath, connectionId, dispatch, query, queryChanged, sObject]);
  useEffect(() => {
    if (soqlQuery && data.entityName) {
      onFieldChange(id, { ...value, entityName: data.entityName }, true);
      dispatch(
        actions.metadata.request(
          connectionId,
          `salesforce/metadata/connections/${connectionId}/sObjectTypes/${data.entityName}`
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
    value,
  ]);

  return (
    <FormControl className={classes.dynasoqlFormControl}>
      <div className={classes.dynasoqlLabelWrapper}>
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
        {/* Todo (surya): fieldhelp needs helptext */}
        <FieldHelp {...props} />
      </div>
      <TextField
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        placeholder={placeholder}
        multiline={multiline}
        value={value.query}
        variant="filled"
        onBlur={handleFieldOnBlur}
        className={classes.formField}
        onChange={handleFieldChange}
      />
    </FormControl>
  );
}
