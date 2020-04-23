import { makeStyles } from '@material-ui/core/styles';
// import useTraceUpdate from 'use-trace-update';
import clsx from 'clsx';
import { Children, cloneElement, useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { disableAllFieldsExceptClockedFields } from '../../forms/utils';
import * as selectors from '../../reducers';
import ButtonGroup from '../ButtonGroup';
import DynaFormGenerator from './DynaFormGenerator';
import useForm from '../Form';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    borderStyle: 'solid',
    borderWidth: '1px 0',
    // backgroundColor: theme.palette.background.paper2,
    borderColor: 'rgb(0,0,0,0.1)',
    // minHeight: '30vh',
    maxHeight: `100%`,
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
    showValidationBeforeTouched,
    fieldMeta,
    full,
    ...rest
  } = props;
  const classes = useStyles();
  const { layout, fieldMap } = fieldMeta;
  const { formKey } = rest;
  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);
  const formKeyUsed = useForm({
    ...rest,
    formKey,
    fieldsMeta: fieldMeta,
    showValidationBeforeTouched,
  });

  if (!layout || !formKeyUsed) {
    return null;
  }

  return (
    <Fragment>
      <div className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKeyUsed}
        />
      </div>
      {/* The children are action buttons for the form */}
      {children && (
        <div className={classes.actions}>
          <ButtonGroup>
            {Children.map(children, child =>
              cloneElement(child, { formKey: formKeyUsed })
            )}
          </ButtonGroup>
        </div>
      )}
    </Fragment>
  );
};

export default function DisabledDynaFormPerUserPermissions(props) {
  // Disabled is a prop to deliberately disable the Form this is added to support a DynaForm within a DynaForm
  const {
    integrationId,
    disabled,
    fieldMeta,
    resourceType,
    resourceId,
  } = props;
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  // pass in the integration Id to find access level of its associated forms
  const { disableAllFields, disableAllFieldsExceptClocked } = useSelector(
    state => selectors.formAccessLevel(state, integrationId, resource, disabled)
  );
  const updatedFieldMeta = useMemo(() => {
    if (disableAllFieldsExceptClocked)
      return disableAllFieldsExceptClockedFields(fieldMeta, resourceType);

    return fieldMeta;
  }, [disableAllFieldsExceptClocked, fieldMeta, resourceType]);

  return (
    <DynaForm
      {...props}
      disabled={disableAllFields}
      fieldMeta={updatedFieldMeta}
      // when its in view mode we disable validation before touch this ensures that there is no
      // required fields errored messages
    />
  );
}
