import React from 'react';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles({
  rowFlexWrapper: {
    flexDirection: 'row',
  },
  flexItems: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
});

export default function DynaRadio(props) {
  const {
    id,
    name,
    options = [],
    defaultValue,
    required,
    value,
    // showOptionsHorizontally is used to control options to render horizontally
    showOptionsHorizontally,
    // set fullWidth to true for component to occupy fill width
    fullWidth,
    label,
    onFieldChange,
  } = props;
  const classes = useStyles();
  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio />}
                label={item}
                className={showOptionsHorizontally ? classes.flexItems : ''}
              />
            );
          }

          return (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio />}
              label={item.label || item.value}
              className={showOptionsHorizontally ? classes.flexItems : ''}
            />
          );
        })
      ),
    []
  );

  return (
    <FormControl
      component="fieldset"
      required={required}
      className={fullWidth ? classes.fullWidth : ''}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        className={showOptionsHorizontally ? classes.rowFlexWrapper : ''}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={evt => {
          onFieldChange(id, evt.target.value);
        }}>
        {items}
      </RadioGroup>
    </FormControl>
  );
}
