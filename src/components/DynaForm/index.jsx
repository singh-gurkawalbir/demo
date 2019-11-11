import { Component } from 'react';
import { Form } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import getRenderer from './renderer';
import DynaFormGenerator from './DynaFormGenerator';
import ButtonGroup from '../ButtonGroup';
import * as selectors from '../../reducers';

@withStyles(theme => ({
  fieldContainer: {
    borderStyle: 'solid',
    borderWidth: '1px 0',
    // backgroundColor: theme.palette.background.paper2,
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
    padding: theme.spacing(2, 3, 0),
  },
}))
class DynaForm extends Component {
  render() {
    const {
      classes,
      className,
      children,
      editMode,
      fieldMeta,
      resourceId,
      resourceType,
      full,
      ...rest
    } = this.props;
    const { layout, fieldMap } = fieldMeta;
    const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType);

    if (!layout) {
      return null;
    }

    return (
      <Form {...rest} showValidationBeforeTouched renderer={renderer}>
        <div className={clsx(classes.fieldContainer, className)}>
          <DynaFormGenerator layout={layout} fieldMap={fieldMap} />
        </div>
        {/* The children are action buttons for the form */}

        <div className={classes.actions}>
          <ButtonGroup>{children}</ButtonGroup>
        </div>
      </Form>
    );
  }
}

export default function DisabledDynaFormPerUserPermissions(props) {
  const { integrationId, fieldMeta } = props;
  // pass in the integration Id to find access level of its associated forms
  const isFormAMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  return (
    <DynaForm
      {...props}
      disabled={isFormAMonitorLevelAccess}
      fieldMeta={fieldMeta}
    />
  );
}
