import { useCallback, Fragment, useEffect } from 'react';
import { Typography, Slider } from '@material-ui/core';
import useFormContext from '../../../Form/FormContext';

export default function DynaSlider(props) {
  const {
    id,
    value,
    onFieldChange,
    clearFields,
    unit,
    step,
    max,
    min,
    setReset,
    formKey,
  } = props;
  const form = useFormContext(formKey);
  const { fields } = form || {};
  const handleChange = useCallback(
    (evt, slidervalue) => {
      if (unit === 'minute' && slidervalue > 9) {
        onFieldChange(id, `10-59/${slidervalue.toString()}`);
      } else onFieldChange(id, `*/${slidervalue.toString()}`);
    },
    [id, onFieldChange, unit]
  );
  const sliderVal = value.split('/') && value.split('/')[1];

  useEffect(() => {
    !sliderVal && onFieldChange(id, `*/${min.toString()}`);
    clearFields.forEach(id => {
      Object.values(fields).some(field => field.id === id) &&
        onFieldChange(id, '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Fragment>
      <Typography>{`Every ${sliderVal} ${unit}`} </Typography>
      <Slider
        value={parseInt(sliderVal, 10)}
        onChange={(evt, value) => {
          setReset && setReset(false);
          handleChange(evt, value);
        }}
        step={step}
        min={min}
        max={max}
      />
    </Fragment>
  );
}
