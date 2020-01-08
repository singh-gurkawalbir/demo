import { useCallback, Fragment } from 'react';
import { Typography, Slider } from '@material-ui/core';

export default function DynaSlider(props) {
  console.log('check ', props);
  const { id, value, onFieldChange, clearFields, unit, step, max, min } = props;
  const handleChange = useCallback(
    (evt, slidervalue) => {
      clearFields.forEach(id => {
        onFieldChange(id, '');
      });
      onFieldChange(id, `*/${slidervalue.toString()}`);
    },
    [clearFields, id, onFieldChange]
  );
  const sliderVal = (value.split('/') && value.split('/')[1]) || min.toString();

  return (
    <Fragment>
      <Typography>{`Every ${sliderVal} ${unit}`} </Typography>
      <Slider
        value={parseInt(sliderVal, 10)}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
      />
    </Fragment>
  );
}
