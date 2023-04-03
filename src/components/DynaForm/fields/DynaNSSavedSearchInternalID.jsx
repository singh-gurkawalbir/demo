import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TextField, FormControl, FormLabel } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  actionBtnSearchInternalID: {
    float: 'right',
    marginTop: theme.spacing(1),
  },
  dynaNSSearchInternalIDFormControl: {
    width: '100%',
  },
  dynaNSSearchInternalIDLabelWrapper: {
    width: '100%',
  },
  dynaNetsuiteFieldLookupWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaNSSearchInternalIDField: {
    width: '100%',
  },
  dynaNSSearchInternalIDActionBtn: {
    marginTop: theme.spacing(1),
  },
}));

// TODO there is duplicate code when we want different variants of text fields like
// DynaRelativeUri, DynaTextFtpPort so we need redesign all related components.

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
    isLoggable,
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
    <>
      <FormControl variant="standard" className={classes.dynaNSSearchInternalIDFormControl}>
        <div className={classes.dynaNSSearchInternalIDLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNSSearchInternalIDField}>
            <TextField
              {...isLoggableAttr(isLoggable)}
              key={id}
              name={name}
              className={classes.dynaNSSearchInternalIDField}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              variant="filled"
              onChange={handleFieldChange}
          />
            <FieldMessage
              isValid={isValid}
              description={description}
              errorMessages={errorMessages}
          />
          </div>
          {value && (
          <ActionButton
            data-test={id}
            onClick={handleOpenNetSuiteSavedSearch}
            className={classes.actionBtnSearchInternalID}>
            <ExitIcon />
          </ActionButton>
          )}
        </div>
      </FormControl>
    </>
  );
}
