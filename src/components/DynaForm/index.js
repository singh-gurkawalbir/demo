import { Component } from 'react';
import { Form } from 'integrator-ui-forms/packages/core/dist';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import getRenderer from './renderer';

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}))
export default class CustomForms extends Component {
  // state = {
  //   values: {},
  // };

  handleCancel = () => {
    console.log('Cancel Clicked. Dont know how to revert form...');
  };

  handleFormChange = (values, isValid) => {
    console.log('DynaForm Changed:', values, isValid);
    // this.setState({
    //   values,
    // });
  };

  // componentDidMount() {
  //   const { defaultValues } = this.props;
  //
  //   console.log('DynaForm componentDidMount default values:', defaultValues);
  //   this.setState({
  //     values: defaultValues,
  //   });
  // }

  setDefaults = (fields, values) => {
    if (!values || !fields) return fields;

    return fields.map(f => {
      if (f && values[f.name]) {
        return { ...f, defaultValue: values[f.name] };
      }

      return f;
    });
  };

  render() {
    const {
      classes,
      defaultValues = {},
      defaultFields,
      children,
      handleSubmit,
      ...rest
    } = this.props;
    // const { values } = this.state;
    const renderer = getRenderer();
    const fields = this.setDefaults(defaultFields, defaultValues);

    return (
      <Form
        {...rest}
        defaultFields={fields}
        renderer={renderer}
        onChange={this.handleFormChange}>
        {children}
        {true && (
          <div className={classes.actions}>
            <Button
              onClick={this.handleCancel}
              className={classes.actionButton}
              size="small"
              variant="contained">
              Cancel
            </Button>
            <DynaSubmit
              onClick={handleSubmit}
              className={classes.actionButton}
              size="small"
              variant="contained"
              color="secondary">
              Save
            </DynaSubmit>
          </div>
        )}
      </Form>
    );
  }
}
