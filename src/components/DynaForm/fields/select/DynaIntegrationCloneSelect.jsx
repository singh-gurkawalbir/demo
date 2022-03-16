import React, { useEffect, useMemo } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { FormControl, FormLabel, makeStyles } from '@material-ui/core';
import Select, { components } from 'react-select';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Spinner from '../../../Spinner';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import { CustomReactSelectStyles } from '../reactSelectStyles/styles';
import ArrowDownIcon from '../../../icons/ArrowDownIcon';

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
});

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <ArrowDownIcon />
  </components.DropdownIndicator>
);

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
  } = props;
  const classes = useStyles();
  const customStyles = CustomReactSelectStyles();

  const handleChange = value => onFieldChange(id, value);

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
            defaultMenuIsOpen
          />
        </span>
        <FieldMessage {...props} />
      </FormControl>
    </>
  );
};

export default function DynaIntegrationCloneSelect(props) {
  const { integrationId } = props;
  const dispatch = useDispatch();
  const {fetchStatus, isLoadingCloneFamily} = useSelector(state => {
    const fetchStatus = selectors.cloneFamilyFetchStatus(state, integrationId);

    return {
      fetchStatus,
      isLoadingCloneFamily: fetchStatus === 'requested',
    };
  }, shallowEqual);

  const cloneList = useSelector(state => selectors.cloneFamily(state, integrationId));
  const accountHasSandbox = useSelector(state => selectors.accountHasSandbox(state));

  useEffect(() => {
    if (!fetchStatus) {
      dispatch(actions.integrationLCM.cloneFamily.request(integrationId));
    }
  }, [dispatch, integrationId, fetchStatus]);

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
    return <Spinner />;
  }

  return <CloneSelect {...props} options={newOptions} showEnvironment={accountHasSandbox} />;
}

