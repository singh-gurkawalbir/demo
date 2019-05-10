import { Component } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';

class FormButton extends Component {
  render() {
    const {
      onGoingComm,
      isValid,
      onClick,
      children,
      className,
      value = {},
    } = this.props;

    return (
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className={className}
        disabled={onGoingComm || !isValid}
        onClick={() => onClick(value)}>
        {children}
      </Button>
    );
  }
}

const DynaSubmit = props => (
  <FormContext.Consumer {...props}>
    {form => <FormButton {...form} {...props} />}
  </FormContext.Consumer>
);

export default DynaSubmit;
