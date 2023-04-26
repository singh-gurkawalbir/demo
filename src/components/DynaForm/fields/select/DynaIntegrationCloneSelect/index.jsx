import React, { useMemo } from 'react';
import {useSelector } from 'react-redux';
import { FormControl, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Select, { components } from 'react-select';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import FieldHelp from '../../../FieldHelp';
import FieldMessage from '../../FieldMessage';
import { CustomReactSelectStyles } from '../../reactSelectStyles/styles';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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
        variant="standard"
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
        { !!options?.length && <FieldMessage {...props} /> }
      </FormControl>
    </>
  );
};

export default function DynaIntegrationCloneSelect(props) {
  const { integrationId, isValid } = props;
  const isLoadingCloneFamily = useSelector(state => selectors.isLoadingCloneFamily(state, integrationId));
  const cloneList = useSelector(state => selectors.cloneFamily(state, integrationId));
  const accountHasSandbox = useSelector(state => selectors.accountHasSandbox(state));

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
    return <Spinner sx={{textAlign: 'center'}} />;
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

