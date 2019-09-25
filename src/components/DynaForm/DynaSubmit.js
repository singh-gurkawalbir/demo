import { Component } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';

class FormButton extends Component {
  render() {
    const {
      disabled,
      isValid,
      onClick,
      children,
      id,
      className,
      value = {},
    } = this.props;

    return (
      <Button
        data-test={id}
        variant="contained"
        color="secondary"
        className={className}
        disabled={disabled || !isValid}
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
