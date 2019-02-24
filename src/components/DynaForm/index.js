import { Component } from 'react';
import { Form } from 'integrator-ui-forms/packages/core/dist';
import getRenderer from './renderer';

export default class DynaForm extends Component {
  render() {
    const { children, ...rest } = this.props;
    const renderer = getRenderer();

    return (
      <Form {...rest} renderer={renderer}>
        {children}
      </Form>
    );
  }
}
