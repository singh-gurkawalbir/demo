import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import { useCallback } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DateTimePicker(props) {
  const { id, label, onFieldChange, value = '', disabled, format } = props;
  const onChange = useCallback(
    value => {
      onFieldChange(id, moment(value).format(format) || '');
    },
    [format, id, onFieldChange]
  );
  const finalFormat =
    format && format.includes('H:mm')
      ? 'MM/DD/YYYY HH:mm'
      : 'MM/DD/YYYY hh:mm a';

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format={finalFormat || 'MM/DD/YYYY hh:mm a'}
        value={value}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        variant="inline"
        onChange={onChange}
        disabled={disabled}
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
