import { Component } from 'react';
import { Form } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import getRenderer from './renderer';
import DynaFormGenerator from './DynaFormGenarator';
import ButtonGroup from '../ButtonGroup';

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
  expansionPanel: {
    width: '100%',
    overflow: 'hidden',
  },
  actions: {
    textAlign: 'right',
    padding: theme.spacing(2, 0, 0),
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
    const { layout } = fieldMeta;
    const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType);

    if (!layout) {
      return null;
    }

    return (
      <Form {...rest} renderer={renderer}>
        <div className={classes.fieldContainer}>
          <DynaFormGenerator layout={layout} />
        </div>
        {/* The children are action buttons for the form */}

        <div className={classes.actions}>
          <ButtonGroup>{children}</ButtonGroup>
        </div>
      </Form>
    );
  }
}
