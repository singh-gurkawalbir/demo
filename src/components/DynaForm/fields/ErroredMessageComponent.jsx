import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '../../icons/ErrorIcon';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&:empty': {
      display: 'none',
    },
  },
  icon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
  },
  description: {
    lineHeight: '20px',
  },
}));
const ErroredMessageComponent = ({ description, errorMessages, isValid }) => {
  const classes = useStyles();

  return description || errorMessages ? (
    <FormHelperText error={!isValid} className={classes.error}>
      {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
