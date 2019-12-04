import { Form } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import getRenderer from './renderer';
import DynaFormGenerator from './DynaFormGenerator';
import ButtonGroup from '../ButtonGroup';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(2, 3, 0),
  },
}));
const DynaForm = props => {
  const {
    className,
    children,
    editMode,
    fieldMeta,
    resourceId,
    resourceType,
    full,
    showValidationBeforeTouched = true,
    ...rest
  } = props;
  const classes = useStyles();
  const { layout, fieldMap } = fieldMeta;
  const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType);

  if (!layout) {
    return null;
  }

  return (
    <Form
      {...rest}
      showValidationBeforeTouched={showValidationBeforeTouched}
      renderer={renderer}>
      <div className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator {...rest} layout={layout} fieldMap={fieldMap} />
      </div>
      {/* The children are action buttons for the form */}
      {children && (
        <div className={classes.actions}>
          <ButtonGroup>{children}</ButtonGroup>
        </div>
      )}
    </Form>
  );
};

export default function DisabledDynaFormPerUserPermissions(props) {
  // Disabled is a prop to deliberately disable the Form this is added to support a DynaForm within a DynaForm
  const { integrationId, fieldMeta, disabled } = props;
  // pass in the integration Id to find access level of its associated forms
  const isFormAMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const viewMode = isFormAMonitorLevelAccess || disabled;

  return (
    <DynaForm
      {...props}
      disabled={viewMode}
      // when its in view mode we disable validation before touch this ensures that there is no
      // required fields errored messages
      showValidationBeforeTouched={!viewMode}
      fieldMeta={fieldMeta}
    />
  );
}
