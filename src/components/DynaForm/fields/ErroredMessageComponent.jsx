import { FormHelperText } from '@material-ui/core';

const ErroredMessageComponent = props => {
  const { description, errorMessages, isValid } = props;

  return description || errorMessages ? (
    <FormHelperText error={!isValid}>
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
