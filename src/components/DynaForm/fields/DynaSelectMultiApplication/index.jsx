import React, { useCallback, useMemo, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select, { components } from 'react-select';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormLabel } from '@mui/material';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import clsx from 'clsx';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import ApplicationImg from '../../../icons/ApplicationImg';
import IntegrationTag from '../../../tags/IntegrationTag';
import SearchIcon from '../../../icons/SearchIcon';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import { CustomReactSelectStyles, ReactSelectUseStyles } from '../reactSelectStyles/styles';
import { DoneButton } from '../../../CeligoSelect';

const useStyles = makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 0,
    alignItems: 'center',
  },
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
  const classes = useStyles();

  return (
    <>
      {label}
      {tag && <IntegrationTag className={classes.tagWrapper} label={tag} />}
    </>
  );
};

const SelectedValueChip = ({value, tag}) => {
  const classes = useStyles();
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

const MultiValueLabel = props => {
  const classes = useStyles();
  const value = typeof props.data === 'object'
    ? (props.data.published && props.data.label) || props.data.value
    : props.data;

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
  const { menuIsOpen, onMenuClose } = props.selectProps;
  const closeSelect = () => {
    if (menuIsOpen) {
      onMenuClose();
    }
  };

  return (
    <components.Menu {...props}>
      {props.children}
      <DoneButton id="select-multi-close" onClose={closeSelect} />
    </components.Menu>
  );
};

const Option = props => {
  const classes = ReactSelectUseStyles();
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
        <span className={clsx(classes.optionLabel, classes.optionLabelMultiSelect)}>{label}</span>
        <span className={classes.optionCheckBox}>
          <Checkbox checked={props.isSelected} />
        </span>
      </components.Option>
    </div>
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
    isLoggable,
  } = props;
  const classes = ReactSelectUseStyles();
  const ref = useRef(null);
  const windowHeight = window.innerHeight;
  const defaultValue = useMemo(() => value.map(val => options[0].items.find(opt => opt.value === val)), [options, value]);
  const handleChange = useCallback(selectedOptions => {
    onFieldChange(id, selectedOptions?.map(opt => opt?.value ? opt.value : opt) || []);
  }, [id, onFieldChange]);
  const customStyles = CustomReactSelectStyles();
  const CustomSelect = creatableMultiSelect ? CreatableSelect : Select;
  const {y: elementPosFromTop = 0} = ref?.current?.getBoundingClientRect() || {};

  const menuPlacement = windowHeight - elementPosFromTop > 479 ? 'bottom' : 'top';

  return (
    <div className={classes.multiSelectWrapper} ref={ref}>
      <div className={classes.labelWrapper}>
        <FormLabel disabled={disabled} htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        variant="standard"
        error={!isValid}
        disabled={disabled}
        required={required}
        className={classes.multiSelectWrapper}>
        <CustomSelect
          isDisabled={disabled}
          {...isLoggableAttr(isLoggable)}
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
          styles={customStyles}
          menuPlacement={menuPlacement}
          captureMenuScroll={false}
        />

        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
