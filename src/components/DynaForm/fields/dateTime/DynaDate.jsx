import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';

export default function DatePicker(props) {
  const { id, label, onFieldChange, value } = props;
  const [dateValue, setDateValue] = useState(value || null);

  useEffect(() => {
    onFieldChange(id, dateValue || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format="MM/dd/yyyy"
        value={dateValue}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={value => setDateValue(value)}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
