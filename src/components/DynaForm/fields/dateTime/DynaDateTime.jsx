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

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format={format}
        value={value}
        allowKeyboardControl={false}
        inputVariant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        onKeyDown={e => {
          e.preventDefault();
        }}
        onKeyPress={e => {
          e.preventDefault();
        }}
        variant="inline"
        onChange={onChange}
        disabled={disabled}
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
