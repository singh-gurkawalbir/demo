import { FormControl, makeStyles, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ErroredMessageComponent from '../ErroredMessageComponent';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles({
  dynaLabelWrapper: {
    flexDirection: `row !important`,
  },
  dynaCheckControlLabel: {
    margin: 0,
    marginRight: 4,
  },
  dynaCheckbox: props => {
    props.hideLabelSpacing ? 0 : 12;
  },
});

export default function DynaCheckbox(props) {
  const classes = useStyles(props);
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    inverse,
    required,
    isValid,
  } = props;

  return (
    <FormControl
      error={!isValid}
      required={required}
      disabled={disabled}
      className={classes.dynaLabelWrapper}>
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            name={name}
            className={classes.dynaCheckbox}
            // isInvalid={!isValid}
            data-test={id}
            value={typeof value === 'string' ? value : value.toString()}
            checked={inverse ? !value : !!value}
            onChange={evt =>
              onFieldChange(
                id,
                inverse ? !evt.target.checked : evt.target.checked
              )
            }
          />
        }
        className={classes.dynaCheckControlLabel}
        label={
          <Typography variant="subtitle2" component="span">
            {label}
          </Typography>
        }
      />
      <FieldHelp {...props} />
      <ErroredMessageComponent {...props} />
    </FormControl>
  );
}
