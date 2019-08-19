import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
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
  } = props;
  const classes = useStyles();
  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            );
          }

          return (
            <MenuItem key={item.value} value={item.value}>
              {item.label || item.value}
            </MenuItem>
          );
        })
      ),
    []
  );
  let processedValue = value;

  if (valueDelimiter && typeof value === 'string') {
    processedValue = value.split(valueDelimiter);
  }

  if (processedValue && !Array.isArray(processedValue)) {
    processedValue = [processedValue];
  }

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
    <FormControl key={id} disabled={disabled} className={classes.formControl}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        multiple
        value={processedValue}
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
  );
}
