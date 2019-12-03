import MomentDateFnsUtils from '@date-io/moment';
import { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';

export default function DateTimePicker(props) {
  const { id, label, onFieldChange, value } = props;
  const [dateValue, setDateValue] = useState(value || null);

  useEffect(() => {
    onFieldChange(id, dateValue || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format="MM/DD/YYYY HH:mm a"
        value={dateValue}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={value => setDateValue(value)}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
