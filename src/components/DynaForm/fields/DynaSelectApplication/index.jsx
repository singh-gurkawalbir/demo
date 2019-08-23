import React, { Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select, { components } from 'react-select';
import { groupApplications } from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';

const groupedApps = groupApplications();
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
}));

export default function SelectApplication(props) {
  const {
    description,
    disabled,
    id,
    name,
    value = '',
    placeholder,
    onFieldChange,
  } = props;
  // Custom styles for Select Control
  const classes = useStyles();
  const theme = useTheme();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '0px',
      color: state.isSelected
        ? theme.selectFormControl.text
        : theme.selectFormControl.color,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.selectFormControl.hover
          : theme.selectFormControl.background,
      border: 'none',
      minHeight: '48px',
      '&:active': {
        backgroundColor: theme.selectFormControl.hover,
        color: theme.selectFormControl.color,
      },
    }),
    control: () => ({
      minWidth: 365,
      height: '48px',
      border: '1px solid',
      borderColor: theme.palette.divider,
      borderRadius: '2px',
      backgroundColor: theme.selectFormControl.background,
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
    }),
    input: () => ({
      color: theme.selectFormControl.color,
    }),
    placeholder: () => ({
      color: theme.selectFormControl.color,
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
      border: '1px solid',
      borderColor: theme.palette.divider,
      background: theme.selectFormControl.separator,
      color: theme.selectFormControl.color,
    }),
    dropdownIndicator: () => ({
      color: theme.selectFormControl.color,
      padding: '8px',
      cursor: 'pointer',
      '&:hover': {
        color: fade(theme.selectFormControl.color, 0.8),
      },
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      const color = `${theme.selectFormControl.color}`;

      return { ...provided, opacity, transition, color };
    },
  };
  // TODO: use the documentation below to customize this component:
  // we are missing styles for "grouping" of applications.
  // https://react-select.com/components#replacing-components
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
      <Fragment>
        <div className={classes.optionRoot}>
          <components.Option {...props}>
            <span className={classes.optionImg}>
              <ApplicationImg type={type} assistant={icon} />
            </span>
            <span className={classes.optionLabel}>{props.label}</span>
          </components.Option>
        </div>
      </Fragment>
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

  return (
    <FormControl key={id} disabled={disabled} className={classes.formControl}>
      <Select
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option }}
        defaultValue={value}
        options={options}
        onChange={e => {
          console.log(e);
          onFieldChange && onFieldChange(id, e.value);
        }}
        styles={customStyles}
        filterOption={filterOptions}
      />
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
}
