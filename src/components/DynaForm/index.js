import { Component } from 'react';
import { Form } from 'integrator-ui-forms/packages/core/dist';
import renderer from './renderer';

export default class CustomForms extends Component {
  render() {
    const { children, ...rest } = this.props;

    return (
      <Form renderer={renderer} {...rest}>
        {children}
      </Form>
    );
  }
}
