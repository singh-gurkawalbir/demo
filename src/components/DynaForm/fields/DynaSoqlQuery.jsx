import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { FormContext } from 'react-forms-processor/dist';
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

function DynaSoqlQuery(props) {
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
    mode,
    filterKey,
    selectField,
    formContext,
  } = props;
  const { value: formValues } = formContext;
  const soqlField = formValues['/salesforce/soql'];
  let query = soqlField && soqlField.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const { data = {} } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      metadataType,
      filterKey,
      recordType,
      selectField
    )
  );
  const handleFieldOnBlur = e => {
    query = e.target.value;
    setsObject(true);
  };

  const handleFieldChange = e => {
    onFieldChange(id, { ...value, query: e.target.value });
  };

  useEffect(() => {
    if (query && sObject) {
      dispatch(
        actions.metadata.request({
          connectionId,
          metadataType,
          recordType,
          addInfo: { query },
        })
      );
      setSoqlQuery(true);
      setsObject(false);
    }
  }, [connectionId, dispatch, metadataType, query, recordType, sObject]);
  useEffect(() => {
    if (soqlQuery && data.entityName) {
      onFieldChange(id, { ...value, entityName: data.entityName });
      dispatch(
        actions.metadata.request({
          connectionId,
          metadataType: 'sObjectTypes',
          recordType: data.entityName,
        })
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

const DynaSoqlQueryFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaSoqlQuery {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaSoqlQueryFormContext;
