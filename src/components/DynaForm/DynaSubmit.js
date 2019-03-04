import { Component } from 'react';
import { FormContext } from 'integrator-ui-forms/packages/core/dist';
import Button from '@material-ui/core/Button';

class FormButton extends Component {
  render() {
    const { isValid, onClick, children, className, value = {} } = this.props;

    return (
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className={className}
        disabled={!isValid}
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
