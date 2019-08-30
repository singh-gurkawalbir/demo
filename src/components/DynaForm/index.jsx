import { Component } from 'react';
import { Form } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import getRenderer from './renderer';
import DynaFormGenerator from './DynaFormGenarator';

@withStyles(theme => ({
  fieldContainer: {
    border: 'solid 1px',
    backgroundColor: theme.palette.background.editorInner,
    borderColor: 'rgb(0,0,0,0.1)',
    minHeight: '30vh',
    maxHeight: `60vh`,
    overflowY: 'auto',
    padding: theme.spacing(1),
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  actions: {
    textAlign: 'right',
    padding: theme.spacing(0.5),
  },
}))
export default class DynaForm extends Component {
  render() {
    const {
      classes,
      children,
      editMode,
      fieldMeta,
      resourceId,
      resourceType,
      ...rest
    } = this.props;
    const { containers } = fieldMeta;
    const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType);

    console.log('containers ', containers);

    if (!containers) {
      return null;
    }

    return (
      <Form {...rest} renderer={renderer}>
        <div className={classes.fieldContainer}>
          <DynaFormGenerator containers={containers} />
        </div>
        {/* The children are action buttons for the form */}

        <div className={classes.actions}>{children}</div>
      </Form>
    );
  }
}
