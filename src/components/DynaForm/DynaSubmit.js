import { Component } from 'react';
import { FormContext } from 'integrator-ui-forms/packages/core/dist';
import Button from '@material-ui/core/Button';

class FormButton extends Component {
  render() {
    const { isValid, onClick, children, value = {}, ...rest } = this.props;

    console.log('DynaSubmit valid? ', isValid);

    return (
      <Button {...rest} disabled={!isValid} onClick={() => onClick(value)}>
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
