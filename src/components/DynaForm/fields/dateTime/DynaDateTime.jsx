import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';

export default function DateTimePicker(props) {
  const { id, label, onFieldChange, value = '', disabled, format } = props;
  const [dateValue, setDateValue] = useState(value || null);

  useEffect(() => {
    onFieldChange(id, moment(dateValue).format(format) || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format={format}
        value={dateValue}
        allowKeyboardControl={false}
        inputVariant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        onKeyDown={e => {
          // this is specifically for qa to inject their date time string
          // they should alter the input dom to add a qa attribute prior to injection for date time
          if (e.target.hasAttribute('qa')) return;

          e.preventDefault();
        }}
        onKeyPress={e => {
          if (e.target.hasAttribute('qa')) return;

          e.preventDefault();
        }}
        variant="dialog"
        invalidLabel={null}
        invalidDateMessage={null}
        onChange={value => setDateValue(value)}
        disabled={disabled}
        clearable
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
