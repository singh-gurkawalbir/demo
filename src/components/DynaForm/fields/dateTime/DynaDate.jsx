import MomentDateFnsUtils from '@date-io/moment';
import { useCallback } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DatePicker(props) {
  const { id, label, onFieldChange, value = '', disabled } = props;
  const onChange = useCallback(
    value => {
      onFieldChange(id, value || '');
    },
    [id, onFieldChange]
  );

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format="MM/DD/YYYY"
        value={value}
        variant="inline"
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={onChange}
        disabled={disabled}
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
