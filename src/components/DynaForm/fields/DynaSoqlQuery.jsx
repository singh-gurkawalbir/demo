import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../reducers';
import actions from '../../../actions';

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
    metadataType,
    recordType,
    multiline,
    filterKey,
  } = props;
  const query = value && value.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/${metadataType}/${recordType}`;
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
  };

  useEffect(() => {
    if (query && sObject) {
      dispatch(actions.metadata.request(connectionId, commMetaPath, { query }));
      setSoqlQuery(true);
      setsObject(false);
    }
  }, [
    commMetaPath,
    connectionId,
    dispatch,
    metadataType,
    query,
    recordType,
    sObject,
  ]);
  useEffect(() => {
    if (soqlQuery && data.entityName) {
      onFieldChange(id, { ...value, entityName: data.entityName });
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
    metadataType,
    onFieldChange,
    recordType,
    soqlQuery,
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
