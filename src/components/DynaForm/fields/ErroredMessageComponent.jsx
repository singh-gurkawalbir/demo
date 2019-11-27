import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  error: {
    margin: [[5, 0, 8, 0]],
  },
});
const ErroredMessageComponent = props => {
  const classes = useStyles();
  const { description, errorMessages, isValid } = props;

  return description || errorMessages ? (
    <FormHelperText error={!isValid} className={classes.error}>
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
