import React, { useCallback } from 'react';
import Select, { components } from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import ApplicationImg from '../../../icons/ApplicationImg';
import Tag from '../../../HomePageCard/Footer/Tag';

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
}));

const chipUseStyles = makeStyles(theme => ({
  chip: {
    margin: 4,
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
      {tag && <Tag className={classes.tagWrapper} variant={tag} />}
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

const Option = props => {
  const classes = useStyles();
  const { type, icon, value, label } = props.data;

  // TODO (Azhar): please do styling changes to options
  return (
    <div data-test={value} className={classes.menuItems}>
      <components.Option {...props}>
        <span className={classes.optionImg}>
          <ApplicationImg
            markOnly
            type={type === 'webhook' ? value : type}
            assistant={icon}
            className={classes.img}
          />
        </span>
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

  // TODO (Azhar): please make styling changes to the chip
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
  } = props;

  const classes = useStyles();
  const handleChange = useCallback(selectedOptions => {
    onFieldChange(id, selectedOptions?.map(opt => opt?.value ? opt.value : opt) || []);
  }, [id, onFieldChange]);

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
        <Select
          isMulti
          placeholder={placeholder}
          components={{ Option, MultiValueLabel }}
          defaultValue={value}
          options={options[0].items}
          onChange={handleChange}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className={classes.wrapper}
          filterOption={filterOptions}
        />

        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
