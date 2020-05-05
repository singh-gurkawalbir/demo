import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&:empty': {
      display: 'none',
    },
  },
  description: {
    lineHeight: '18px',
  },
}));
const ErroredMessageComponent = ({ description, errorMessages, isValid }) => {
  const classes = useStyles();

  return description || errorMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.error, { [classes.description]: description })}>
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
