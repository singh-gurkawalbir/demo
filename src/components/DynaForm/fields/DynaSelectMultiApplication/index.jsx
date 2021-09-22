import React, { useCallback, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select, { components } from 'react-select';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { Button, FormControl, FormLabel } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import ApplicationImg from '../../../icons/ApplicationImg';
import Tag from '../../../HomePageCard/Footer/Tag';
import SearchIcon from '../../../icons/SearchIcon';

const useStyles = makeStyles(theme => ({
  optionRoot: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '&:before': {
      display: 'none',
    },
  },
  wrapper: {
    minHeight: 38,
    height: 'auto',
    '& >.MuiSelect-selectMenu': {
      height: 'auto',
    },
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 0,
    alignItems: 'center',
  },
  multiSelectWrapper: {
    width: '100%',
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
    width: '600px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '100%',
  },
  optionCheckBox: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '5px',
    height: '100%',
  },
  doneButton: {
    width: '100%',
    minHeight: 42,
    margin: 0,
    padding: 0,
    border: '1px solid',
    borderColor: `${theme.palette.secondary.lightest} !important`,
    borderRadius: 0,
  },
  img: {
    maxWidth: '70px',
  },
}));

const chipUseStyles = makeStyles(theme => ({
  chip: {
    margin: 0,
    background: 'none',
    borderRadius: 0,
    border: 'none',
    height: 'unset',
    '& >.MuiChip-label': {
      padding: 0,
    },

  },
  tagWrapper: {
    color: theme.palette.secondary.light,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const ChipLabel = ({label, tag}) => {
  const classes = chipUseStyles();

  return (
    <>
      {label}
      {tag && <Tag className={classes.tagWrapper} label={tag} />}
    </>
  );
};

const SelectedValueChip = ({value, tag}) => {
  const classes = chipUseStyles();
  const newLabel = <ChipLabel label={value} tag={tag} />;

  return (
    <Chip
      key={value}
      label={newLabel}
      className={classes.chip}
    />
  );
};

const filterOptions = (candidate, input) => {
  if (input) {
    const term = input.toLowerCase();
    const { label } = candidate.data;

    return (label && label.toLowerCase().includes(term));
  }

  return true;
};

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <SearchIcon />
  </components.DropdownIndicator>
);

const Option = props => {
  const classes = useStyles();
  const { type, icon, value, label } = props.data;
  const {hideApplicationImg} = props.selectProps;

  return (
    <div data-test={value} className={classes.menuItems}>
      <components.Option {...props}>
        {!hideApplicationImg ? (
          <span className={classes.optionImg}>
            <ApplicationImg
              markOnly
              type={type === 'webhook' ? value : type}
              assistant={icon}
              className={classes.img}
          />
          </span>
        ) : ''}
        <span className={classes.optionLabel}>{label}</span>
        <span className={classes.optionCheckBox}>
          <Checkbox
            checked={props.isSelected}
            color="primary"
          />
        </span>
      </components.Option>
    </div>
  );
};

const MultiValueLabel = props => {
  const classes = useStyles();
  const value = typeof props.data === 'object' ? props.data.value : props.data;

  return (
    <div data-test={value} className={classes.chips}>
      <components.MultiValueLabel {...props}>
        <SelectedValueChip
          value={value}
        />
      </components.MultiValueLabel>
    </div>
  );
};

const Menu = props => {
  const classes = useStyles();
  const { menuIsOpen, onMenuClose } = props.selectProps;
  const closeSelect = () => {
    if (menuIsOpen) {
      onMenuClose();
    }
  };

  return (
    <components.Menu {...props}>
      {props.children}
      <Button
        id="select-multi-close"
        variant="outlined"
        color="secondary"
        onClick={closeSelect}
        className={classes.doneButton}>
        Done
      </Button>
    </components.Menu>
  );
};

export default function MultiSelectApplication(props) {
  const {
    disabled,
    id,
    label,
    required,
    options = [],
    removeHelperText = false,
    value = [],
    placeholder,
    isValid,
    onFieldChange,
    creatableMultiSelect,
    hideApplicationImg,
  } = props;
  const theme = useTheme();
  const classes = useStyles();
  const defaultValue = useMemo(() => value.map(val => options[0].items.find(opt => opt.value === val)), [options, value]);
  const handleChange = useCallback(selectedOptions => {
    onFieldChange(id, selectedOptions?.map(opt => opt?.value ? opt.value : opt) || []);
  }, [id, onFieldChange]);
  // TODO: @Azhar optimize the code for this library.
  const customStylesMultiselect = {
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
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: () => ({
      minWidth: 365,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      borderRadius: '2px',
      backgroundColor: theme.palette.background.paper,
      alignItems: 'flex-start',
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
    indicatorsContainer: () => ({
      height: '38px',
      display: 'flex',
      alignItems: 'center',
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
      minWidth: theme.spacing(10),
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
      maxHeight: '260px',
      overflowY: 'auto',
    }),
    group: () => ({
      padding: '0px',
    }),
    valueContainer: () => ({
      minHeight: '38px',
      maxHeight: '100%',
      alignItems: 'center',
      display: 'flex',
      flex: '1',
      padding: '2px 8px',
      position: 'relative',
      overflow: 'hidden',
      flexWrap: 'wrap',
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
    multiValue: styles => ({
      ...styles,
      backgroundColor: 'white',
      borderRadius: theme.spacing(3),
      height: 28,
      minWidth: 'unset',
      padding: '1px 8px',
      border: `1px solid ${theme.palette.secondary.lightest}`,
    }),
    multiValueLabel: styles => ({
      ...styles,
      borderRadius: 0,
      padding: 0,
    }),
    multiValueRemove: styles => ({
      ...styles,
      paddingRight: 'unset',
      color: theme.palette.text.secondary,
      ':hover': {
        color: theme.palette.secondary.main,
      },
    }),
  };
  const CustomSelect = creatableMultiSelect ? CreatableSelect : Select;

  return (
    <div className={classes.multiSelectWrapper}>
      <div className={classes.labelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        error={!isValid}
        disabled={disabled}
        required={required}
        className={classes.multiSelectWrapper}>
        <CustomSelect
          isMulti
          hideApplicationImg={hideApplicationImg}
          placeholder={placeholder}
          components={{ Option, MultiValueLabel, DropdownIndicator, Menu }}
          defaultValue={defaultValue}
          options={options[0].items}
          onChange={handleChange}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className={classes.wrapper}
          filterOption={filterOptions}
          styles={customStylesMultiselect}
        />

        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
