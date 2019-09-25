import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select, { components } from 'react-select';
import { groupApplications } from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';

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
    resourceContext,
  } = props;
  // Custom styles for Select Control
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
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

  const handleChange = e => {
    const patchSet = [{ op: 'replace', path: name, value: e.value }];

    onFieldChange && onFieldChange(id, e.value);
    dispatch(
      actions.resource.patchStaged(
        resourceContext.resourceId,
        patchSet,
        SCOPES.VALUE
      )
    );
  };

  return (
    <FormControl key={id} disabled={disabled} className={classes.formControl}>
      <Select
        data-test={id}
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option }}
        defaultValue={value}
        options={options}
        onChange={handleChange}
        styles={customStyles}
        filterOption={filterOptions}
      />
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
}
