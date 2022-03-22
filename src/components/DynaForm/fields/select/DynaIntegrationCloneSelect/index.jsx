import React, { useEffect, useMemo } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import { FormControl, FormLabel, makeStyles } from '@material-ui/core';
import Select, { components } from 'react-select';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import FieldHelp from '../../../FieldHelp';
import FieldMessage from '../../FieldMessage';
import { CustomReactSelectStyles } from '../../reactSelectStyles/styles';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import ErrorMessage from './ErrorMessage';

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  spinnerWrapper: {
    textAlign: 'center',
  },
  environment: {
    display: 'flex',
    alignItems: 'center',
  },
});

export const CloneSelect = props => {
  const {
    disabled,
    required,
    isValid,
    label,
    value,
    showEnvironment,
    onFieldChange,
    id,
    options,
    isLoggable,
    integrationId,
  } = props;
  const classes = useStyles();
  const customStyles = CustomReactSelectStyles();

  const handleChange = value => onFieldChange(id, value);
  const DropdownIndicator = props => (
    <components.DropdownIndicator {...props} className={classes.environment}>
      {showEnvironment && value?.environment}
      <ArrowDownIcon />
    </components.DropdownIndicator>
  );
  const Option = props => {
    const classes = useStyles();
    const { label, data } = props;

    return (
      <components.Option {...props}>
        <div className={classes.optionContainer}>
          <div>{ label }</div>
          { showEnvironment ? (<div> {data.environment}  </div>) : ''}
        </div>
      </components.Option>
    );
  };

  return (
    <>
      <div className={classes.fullWidth}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        className={classes.fullWidth}
        error={!isValid}
        disabled={disabled}
        required={required}>
        <span {...isLoggableAttr(isLoggable)}>
          <Select
            isDisabled={disabled}
            placeholder="Please select"
            components={{ DropdownIndicator, Option }}
            options={options}
            value={value}
            onChange={handleChange}
            styles={customStyles}
            isSearchable={false}
            defaultMenuIsOpen={options?.length}
          />
        </span>
        {
            options?.length
              ? <FieldMessage {...props} />
              : <ErrorMessage integrationId={integrationId} />
        }
      </FormControl>
    </>
  );
};

export default function DynaIntegrationCloneSelect(props) {
  const classes = useStyles();
  const { integrationId, isValid } = props;
  const dispatch = useDispatch();
  const isLoadingCloneFamily = useSelector(state => selectors.isLoadingCloneFamily(state, integrationId));
  const cloneList = useSelector(state => selectors.cloneFamily(state, integrationId));
  const accountHasSandbox = useSelector(state => selectors.accountHasSandbox(state));

  useEffect(() => {
    dispatch(actions.integrationLCM.cloneFamily.request(integrationId));

    return () => dispatch(actions.integrationLCM.cloneFamily.clear(integrationId));
  }, [dispatch, integrationId]);

  const newOptions = useMemo(
    () => (cloneList || []).map(clone =>
      ({
        label: clone.name,
        value: clone._id,
        environment: clone.sandbox ? 'Sandbox' : 'Production',
      })),
    [cloneList]
  );

  if (isLoadingCloneFamily) {
    return <Spinner className={classes.spinnerWrapper} />;
  }

  return (
    <CloneSelect
      {...props}
      options={newOptions}
      showEnvironment={accountHasSandbox}
      isValid={isValid && cloneList?.length}
   />
  );
}

