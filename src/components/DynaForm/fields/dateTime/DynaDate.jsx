import MomentDateFnsUtils from '@date-io/moment';
import { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DatePicker(props) {
  const { id, label, onFieldChange, value, disabled } = props;
  const [dateValue, setDateValue] = useState(value || null);

  useEffect(() => {
    onFieldChange(id, dateValue || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format="MM/DD/YYYY"
        value={dateValue}
        variant="inline"
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={value => setDateValue(value)}
        disabled={disabled}
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
