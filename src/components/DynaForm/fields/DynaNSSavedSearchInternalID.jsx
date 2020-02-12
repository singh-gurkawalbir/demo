import { Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import * as selectors from '../../../reducers';
import openExternalUrl from '../../../utils/window';

const useStyles = makeStyles(() => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: 5,
  },
}));

export default function DynaNSSavedSearchInternalID(props) {
  const {
    description,
    disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value = '',
    label,
    connectionId,
  } = props;
  const handleFieldChange = event => {
    const { value } = event.target;

    onFieldChange(id, value);
  };

  const netSuiteSystemDomain = useSelector(state => {
    const connection = selectors.resource(state, 'connections', connectionId);

    return (
      connection &&
      connection.netsuite &&
      connection.netsuite.dataCenterURLs &&
      connection.netsuite.dataCenterURLs.systemDomain
    );
  });
  const handleOpenNetSuiteSavedSearch = useCallback(() => {
    if (netSuiteSystemDomain && value) {
      openExternalUrl({
        url: `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value}`,
      });
    }
  }, [netSuiteSystemDomain, value]);
  const classes = useStyles();

  return (
    <Fragment>
      {value && (
        <ActionButton
          data-test={id}
          onClick={handleOpenNetSuiteSavedSearch}
          className={classes.exitButton}>
          <ExitIcon />
        </ActionButton>
      )}
      <TextField
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        required={required}
        error={!isValid}
        value={value}
        variant="filled"
        onChange={handleFieldChange}
      />
    </Fragment>
  );
}
