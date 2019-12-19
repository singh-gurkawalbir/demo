import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    minHeight: 50,
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      marginTop: theme.spacing(-1),
      '&.MuiInputLabel-shrink': {
        marginTop: 5,
      },
      '& + div': {
        marginTop: 0,
        top: 0,
      },
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },

    '& > *': {
      padding: [[0, 12]],
      background: 'none',
    },
    '& > div > div ': {
      paddingTop: theme.spacing(3),
    },
    '& svg': {
      right: theme.spacing(1),
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  menuItems: {
    paddingRight: 0,
    paddingLeft: 0,
    '&:before': {
      display: 'none',
    },
  },
}));

export default function DynaMultiSelect(props) {
  const {
    disabled,
    id,
    name,
    options = [],
    value = [],
    label,
    onFieldChange,
    valueDelimiter,
    isValid,
    required,
  } = props;
  const classes = useStyles();
  let processedValue = value || [];

  if (valueDelimiter && typeof value === 'string') {
    processedValue = value ? value.split(valueDelimiter) : [];
  }

  if (processedValue && !Array.isArray(processedValue)) {
    processedValue = [processedValue];
  }

  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <MenuItem key={item} value={item} className={classes.menuItems}>
                <Checkbox
                  checked={processedValue.indexOf(item) !== -1}
                  color="primary"
                />
                <ListItemText primary={item} />
              </MenuItem>
            );
          }

          return (
            <MenuItem
              key={item.value}
              value={item.value}
              className={classes.menuItems}>
              <Checkbox
                checked={processedValue.indexOf(item.value) !== -1}
                color="primary"
              />
              <ListItemText primary={item.label || item.value} />
            </MenuItem>
          );
        })
      ),
    []
  );
  const createChip = value => {
    const fieldOption = options[0].items.find(option => option.value === value);

    return fieldOption ? (
      <Chip
        key={value}
        label={fieldOption.label || value}
        className={classes.chip}
      />
    ) : null;
  };

  return (
    <div>
      <FormControl
        key={id}
        disabled={disabled}
        error={!isValid}
        required={required}
        className={classes.root}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          multiple
          data-test={id}
          disabled={disabled}
          value={processedValue}
          IconComponent={ArrowDownIcon}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
          input={<Input name={name} id={id} />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected &&
                typeof selected.map === 'function' &&
                selected.map(createChip)}
            </div>
          )}>
          {items}
        </Select>
      </FormControl>

      <ErroredMessageComponent {...props} />
    </div>
  );
}
