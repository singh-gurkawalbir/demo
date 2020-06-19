import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import * as selectors from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
  },
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
      <FormControl className={classes.dynaNSSearchInternalIDFormControl}>
        <div className={classes.dynaNSSearchInternalIDLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNSSearchInternalIDField}>
            <TextField
              key={id}
              name={name}
              className={classes.dynaNSSearchInternalIDField}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              variant="filled"
              onChange={handleFieldChange}
            />
            <ErroredMessageComponent
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
