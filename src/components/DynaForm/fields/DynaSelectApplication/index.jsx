import React, { useMemo } from 'react';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import Select, { components } from 'react-select';
import applications, {
  groupApplications,
} from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';
import AppPill from './AppPill';

const useStyles = makeStyles(theme => ({
  optionRoot: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    wordBreak: 'break-word',
    padding: '0px',
  },
  optionImg: {
    minWidth: '120px',
    display: 'flex',
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
    color: theme.palette.divider,
    height: '100%',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '100%',
  },
  inputLabel: {
    transform: 'unset',
    position: 'static',
    marginBottom: theme.spacing(1),
  },
  selectedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

export default function SelectApplication({
  description,
  disabled,
  id,
  isMulti,
  name,
  label,
  resourceType,
  value = isMulti ? [] : '',
  placeholder,
  onFieldChange,
}) {
  // Custom styles for Select Control
  const groupedApps = useMemo(() => groupApplications(resourceType), [
    resourceType,
  ]);
  const classes = useStyles();
  const theme = useTheme();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '0px',
      color: state.isSelected
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.palette.background.default
          : theme.palette.background.paper,
      border: 'none',
      minHeight: '48px',
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: () => ({
      minWidth: 365,
      height: '48px',
      border: '1px solid',
      borderColor: theme.palette.divider,
      borderRadius: '2px',
      backgroundColor: theme.palette.background.paper,
      alignItems: 'center',
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      minHeight: '38px',
      position: 'relative',
      boxSizing: 'borderBox',
      transition: 'all 100ms ease 0s',
      outline: `0px !important`,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    }),
    menu: () => ({
      zIndex: 2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      width: '100%',
    }),
    input: () => ({
      color: theme.palette.secondary.light,
    }),
    placeholder: () => ({
      color: theme.palette.secondary.light,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: () => ({
      padding: '0px',
      maxHeight: '300px',
      overflowY: 'auto',
    }),
    group: () => ({
      padding: '0px',
    }),
    groupHeading: () => ({
      textAlign: 'center',
      fontSize: '12px',
      padding: '5px',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
      background: theme.palette.background.paper2,
      color: theme.palette.secondary.light,
    }),
    dropdownIndicator: () => ({
      color: theme.palette.secondary.light,
      padding: '8px',
      cursor: 'pointer',
      '&:hover': {
        color: fade(theme.palette.secondary.light, 0.8),
      },
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      const color = theme.palette.secondary.light;

      return { ...provided, opacity, transition, color };
    },
  };
  const options = groupedApps.map(group => ({
    label: group.label,
    options: group.connectors.map(app => ({
      value: app.id,
      type: app.type,
      icon: app.icon || app.assistant,
      label: app.name,
      keywords: app.keywords,
    })),
  }));
  const Option = props => {
    const { type, icon } = props.data;

    return (
      <div data-test={props.label} className={classes.optionRoot}>
        <components.Option {...props}>
          <span className={classes.optionImg}>
            <ApplicationImg type={type} assistant={icon} />
          </span>
          <span className={classes.optionLabel}>{props.label}</span>
        </components.Option>
      </div>
    );
  };

  const filterOptions = (candidate, input) => {
    if (input) {
      const term = input.toLowerCase();
      const { label, keywords } = candidate.data;

      return (
        (label && label.toLowerCase().includes(term)) ||
        (keywords && keywords.includes(term))
      );
    }

    return true;
  };

  const handleChange = e => {
    if (onFieldChange) {
      const newValue = isMulti ? [...value, e.value] : e.value;

      console.log('newValue', newValue);
      onFieldChange(id, newValue);
    }
  };

  const defaultValue =
    !value || isMulti
      ? ''
      : {
          value,
          label: applications.find(a => a.id === value).name,
        };

  return (
    <FormControl
      data-test={id}
      key={id}
      disabled={disabled}
      className={classes.formControl}>
      <InputLabel shrink className={classes.inputLabel} htmlFor={id}>
        {label}
      </InputLabel>
      <Select
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option }}
        defaultValue={defaultValue}
        options={options}
        onChange={handleChange}
        styles={customStyles}
        filterOption={filterOptions}
      />
      {description && <FormHelperText>{description}</FormHelperText>}

      {isMulti && value.length > 0 && (
        <div className={classes.selectedContainer}>
          {value.map(appId => (
            <AppPill key={appId} appId={appId} />
          ))}
        </div>
      )}
    </FormControl>
  );
}
