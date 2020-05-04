import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
  error: {
    margin: [[5, 0, 8, 0]],
    '&:empty': {
      display: 'none',
    },
  },
  description: {
    lineHeight: '18px',
  },
});
const ErroredMessageComponent = props => {
  const classes = useStyles();
  const { description, errorMessages, isValid } = props;

  return description || errorMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.error, { [classes.description]: description })}>
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
