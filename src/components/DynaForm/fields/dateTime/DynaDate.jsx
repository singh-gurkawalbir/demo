import MomentDateFnsUtils from '@date-io/moment';
import { useState, useEffect } from 'react';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DatePicker(props) {
  const { id, label, onFieldChange, value = '', disabled } = props;
  const [dateValue, setDateValue] = useState(value || null);
  const format = 'MM/DD/YYYY';

  useEffect(() => {
    onFieldChange(id, moment(dateValue).format(format) || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format={format}
        value={dateValue}
        invalidLabel={null}
        invalidDateMessage={null}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={setDateValue}
        disabled={disabled}
        clearable
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
