import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DateTimePicker(props) {
  const { id, label, onFieldChange, value, disabled, format } = props;
  const [dateValue, setDateValue] = useState(value || null);

  useEffect(() => {
    onFieldChange(id, moment(dateValue).format(format) || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);
  const finalFormat = format.includes('H:mm')
    ? 'MM/DD/YYYY HH:mm'
    : 'MM/DD/YYYY hh:mm a';

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format={finalFormat || 'MM/DD/YYYY hh:mm a'}
        value={dateValue}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        variant="inline"
        onChange={value => setDateValue(value)}
        disabled={disabled}
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
