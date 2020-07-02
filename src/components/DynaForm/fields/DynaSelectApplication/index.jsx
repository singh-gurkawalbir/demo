import React, { useMemo, useRef, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormControl, InputLabel } from '@material-ui/core';
import Select, { components } from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import { applicationsList, groupApplications } from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';
import AppPill from './AppPill';
import ErroredMessageComponent from '../ErroredMessageComponent';
import SearchIcon from '../../../icons/SearchIcon';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  optionRoot: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    wordBreak: 'break-word',
    padding: '0px',
  },
  optionImg: {
    width: '120px',
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
  },
  img: {
    maxWidth: '100%',
    padding: '0px 16px',
  },
  selectedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
}));

export default function SelectApplication(props) {
  const {
    disabled,
    appType,
    id,
    isMulti,
    name,
    label,
    flowId,
    options: fieldOptions,
    resourceType,
    resourceId,
    value = isMulti ? [] : '',
    placeholder,
    onFieldChange,
    proceedOnChange,
  } = props;
  const match = useRouteMatch();
  const classes = useStyles();
  const theme = useTheme();
  const ref = useRef(null);
  const isDataLoader = useSelector(state =>
    selectors.isDataLoader(state, flowId)
  );
  const groupedApps = useMemo(
    () =>
      groupApplications(resourceType, {
        appType: appType || (fieldOptions && fieldOptions.appType),
        isSimpleImport: isDataLoader,
      }),
    [appType, fieldOptions, isDataLoader, resourceType]
  );

  // Custom styles for Select Control
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '0px',
      color: state.isSelected
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.palette.background.paper2
          : theme.palette.background.paper,
      border: 'none',
      minHeight: '38px',
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: () => ({
      minWidth: 365,
      height: '38px',
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
      outline: '0px !important',
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
      // marginLeft: 3,
    }),
    placeholder: () => ({
      color: theme.palette.secondary.light,
      position: 'absolute',
      height: '100%',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: () => ({
      padding: '0px',
      maxHeight: 'calc(100vh - 320px)',
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
      background: theme.palette.secondary.lightest,
      color: theme.palette.text.secondary,
    }),
    dropdownIndicator: () => ({
      color: theme.palette.secondary.light,
      padding: theme.spacing(0.5, 1, 0, 1),
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
      assistant: app.assistant,
    })),
  }));

  const DropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
      <SearchIcon />
    </components.DropdownIndicator>
  );
  const Option = props => {
    const { type, icon, value } = props.data;

    return (
      <div data-test={props.label} className={classes.optionRoot}>
        <components.Option {...props}>
          <span className={classes.optionImg}>
            <ApplicationImg
              markOnly
              type={type === 'webhook' ? value : type}
              assistant={icon}
              className={classes.img}
            />
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
  const applications = applicationsList();

  const defaultValue =
    !value || isMulti
      ? ''
      : {
        value,
        label: applications.find(a => a.id === value).name,
      };

  const dispatch = useDispatch();
  const handleChange = useCallback(e => {
    ref?.current?.select?.blur();
    const newValue = isMulti ? [...value, e.value] : e.value;

    if (onFieldChange) {
      onFieldChange(id, newValue);
    }
    // when proceedOnChange is true
    // it means this form contains only this one field
    // we dispatch form submit as soon as the new value is vetted
    if (proceedOnChange && applications.find(a => a.id === newValue)) {
      const values = {};
      values[id] = newValue;
      dispatch(
        actions.resourceForm.submit(
          resourceType,
          resourceId,
          values,
          match,
          false,
          false,
          flowId
        )
      );
    }
  }, [isMulti, value, onFieldChange, proceedOnChange, applications, id, dispatch, resourceType, resourceId, match, flowId]);


  const handleFocus = useCallback(() => {
    const refState = ref?.current?.state;
    const inputValue = refState.value?.label;

    if (inputValue) {
      refState.inputValue = inputValue;
    }
  }, []);

  function handleRemove(index) {
    const newApps = [...value];

    newApps.splice(index, 1);
    onFieldChange(id, newApps);
  }

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
        ref={ref}
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option, DropdownIndicator }}
        defaultValue={defaultValue}
        defaultMenuIsOpen={!value}
        options={options}
        onChange={handleChange}
        onFocus={handleFocus}
        // onBlur={handleBlur}
        styles={customStyles}
        filterOption={filterOptions}
      />

      <ErroredMessageComponent {...props} />

      {isMulti && value.length > 0 && (
        <div className={classes.selectedContainer}>
          {value.map((appId, i) => (
            <AppPill
              // i think we are ok to add index when a user selects multiple
              // same applications. Even if a user deletes a matching app, the
              // keys would still work out. Not sure how else to assign keys here.
              // eslint-disable-next-line react/no-array-index-key
              key={`${appId}-${i}`}
              appId={appId}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </div>
      )}
    </FormControl>
  );
}
