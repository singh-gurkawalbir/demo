import React, { Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
// import Typography from '@material-ui/core/Typography';
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
  },
  optionImg: {
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.selectFormControl.hover,
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
  },
  groupSeparator: {
    padding: '5px 10px',
    background: theme.selectFormControl.separator,
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
      color: state.isSelected
        ? theme.selectFormControl.text
        : theme.selectFormControl.color,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.selectFormControl.hover
          : theme.selectFormControl.background,
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
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
          <span className={classes.optionImg}>
            <ApplicationImg type={type} assistant={icon} />
          </span>
          <components.Option {...props} />
        </div>
        {/* <div className={classes.groupSeparator}>
              <Typography
                className={classes.dividerFullWidth}
                color="textSecondary"
                display="block"
                variant="caption">
                Databases
              </Typography>
            </div> */}
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
          onFieldChange && onFieldChange(id, e.value);
        }}
        styles={customStyles}
        filterOption={filterOptions}
      />
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
}
