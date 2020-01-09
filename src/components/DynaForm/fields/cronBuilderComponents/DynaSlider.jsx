import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useCallback, Fragment, useEffect } from 'react';
import { Typography, Slider } from '@material-ui/core';

function DynaSlider(props) {
  const {
    id,
    value,
    onFieldChange,
    clearFields,
    fields,
    unit,
    step,
    max,
    min,
  } = props;
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
      fields.some(field => field.id === id) && onFieldChange(id, '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

export default function DynaGroupedButton(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaSlider {...props} fields={form.fields} />}
    </FormContext.Consumer>
  );
}
