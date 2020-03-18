import MomentDateFnsUtils from '@date-io/moment';
import { useCallback } from 'react';
import moment from 'moment';
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
      onFieldChange(id, moment(value).format('MM/DD/YYYY') || '');
    },
    [id, onFieldChange]
  );

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format="MM/DD/YYYY"
        value={value}
        invalidLabel={null}
        invalidDateMessage={null}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={onChange}
        disabled={disabled}
        clearable
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
