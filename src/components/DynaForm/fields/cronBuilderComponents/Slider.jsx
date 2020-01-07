import { useCallback, Fragment } from 'react';
import { Typography } from '@material-ui/core';

export default function Slider(props) {
  const { id, value, onFieldChange, unit, index, step, max, min } = props;
  const indvValues = value && value.split(' ');
  const handleChange = useCallback(value => onFieldChange(id, value), [
    id,
    onFieldChange,
  ]);
  const val = (indvValues && indvValues[index]) || '';

  return (
    <Fragment>
      <Typography>{`Every ${value} ${unit}`} </Typography>
      <Slider
        value={val}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
      />
    </Fragment>
  );
}
