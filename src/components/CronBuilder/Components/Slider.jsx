import React, { useCallback } from 'react';
import { Typography, Slider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  titleSlider: {
    paddingTop: theme.spacing(1),
    marginLeft: theme.spacing(-1),
    fontWeight: 'bold',
  },
  sliderWrapper: {
    padding: theme.spacing(1, 2),
  },
}));
export default function DynaSlider(props) {
  const classes = useStyles();
  const {
    value,
    onFieldChange,
    unit,
    step,
    max,
    min,
  } = props;
  //   const fields = useFormContext(formKey)?.fields;
  const handleChange = useCallback(
    (evt, slidervalue) => {
      if (unit === 'minute' && slidervalue > 10) {
        onFieldChange(`10-59/${slidervalue.toString()}`);
      } else onFieldChange(`*/${slidervalue.toString()}`);
    },
    [onFieldChange, unit]
  );
  const sliderVal = value.split('/') && value.split('/')[1];

  return (
    <div className={classes.sliderWrapper}>
      <Typography className={classes.titleSlider}>{`Every ${sliderVal} ${unit}`} </Typography>
      <Slider
        value={parseInt(sliderVal, 10)}
        onChange={(evt, value) => {
          handleChange(evt, value);
        }}
        step={step}
        min={min}
        max={max}
        />
    </div>
  );
}
