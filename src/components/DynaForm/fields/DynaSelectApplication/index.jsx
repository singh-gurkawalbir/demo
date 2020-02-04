import React, { useMemo } from 'react';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormControl, InputLabel } from '@material-ui/core';
import Select, { components } from 'react-select';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import applications, {
  groupApplications,
} from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';
import AppPill from './AppPill';
import ErroredMessageComponent from '../ErroredMessageComponent';
import LoadResources from '../../../LoadResources';

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
    value = isMulti ? [] : '',
    placeholder,
    onFieldChange,
  } = props;
  const assistants = useSelector(
    state =>
      selectors.resourceList(state, {
        type: 'ui/assistants',
      }),
    (left, right) => isEqual(left, right)
  );
  // Custom styles for Select Control
  const flowDetails = useSelector(state =>
    selectors.flowDetails(state, flowId)
  );
  const groupedApps = useMemo(
    () =>
      groupApplications(resourceType, {
        assistants,
        appType: appType || (fieldOptions && fieldOptions.appType),
        isSimpleImport: flowDetails && !!flowDetails.isSimpleImport,
      }),
    [appType, assistants, fieldOptions, flowDetails, resourceType]
  );
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
      position: 'absolute',
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
      assistant: app.assistant,
    })),
  }));
  const Option = props => {
    const { type, icon, value } = props.data;

    return (
      <div data-test={props.label} className={classes.optionRoot}>
        <components.Option {...props}>
          <span className={classes.optionImg}>
            <ApplicationImg
              type={type === 'webhook' ? value : type}
              assistant={icon}
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

  const defaultValue =
    !value || isMulti
      ? ''
      : {
          value,
          label: applications.find(a => a.id === value).name,
        };

  function handleChange(e) {
    if (onFieldChange) {
      const newValue = isMulti ? [...value, e.value] : e.value;

      // console.log('newValue', newValue);
      onFieldChange(id, newValue);
    }
  }

  function handleRemove(index) {
    const newApps = [...value];

    newApps.splice(index, 1);
    onFieldChange(id, newApps);
  }

  return (
    <LoadResources resources="ui/assistants">
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
          defaultMenuIsOpen={!value}
          options={options}
          onChange={handleChange}
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
    </LoadResources>
  );
}
