import React, { useMemo, useRef, useEffect } from 'react';
import { Form } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import getRenderer from './renderer';
import DynaFormGenerator from './DynaFormGenerator';
import ButtonGroup from '../ButtonGroup';
import * as selectors from '../../reducers';
import { disableAllFieldsExceptClockedFields } from '../../forms/utils';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    maxHeight: '100%',
    overflowY: 'auto',
    padding: theme.spacing(1),
    border: 'none',
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
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  resourceFormButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  }
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
    isResourceForm,
    proceedOnChange,
    autoFocus = false,
    ...rest
  } = props;
  const classes = useStyles();
  let { layout } = fieldMeta;
  const { fieldMap } = fieldMeta;
  const { formState } = rest;
  const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType, proceedOnChange);
  const showValidationBeforeTouched = useMemo(
    () => (formState && formState.showFormValidationsBeforeTouch) || false,
    [formState]
  );
  const formRef = useRef();
  useEffect(() => {
    if (!autoFocus) return;

    const firstInput = formRef.current?.querySelector?.('input');

    if (firstInput?.focus) {
      setTimeout(() => firstInput?.focus?.(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current]);

  if (!layout) {
    if (!fieldMap) {
      return null;
    }

    // if no layout metadata accompanies the fieldMap,
    // then the order in which the fields are defined in the map are used as the layout.
    layout = { fields: [] };
    Object.keys(fieldMap).forEach(fieldId => {
      layout.fields.push(fieldId);
    });

    // return null;
  }
  return (
    <div ref={formRef} >
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
          {/* Incase of a resource form,  isResourceForm property allows the button group container to be split left and right
            * based on primary and secondary action buttons
            */}
          <ButtonGroup
            className={clsx({
              [classes.resourceFormButtons]: isResourceForm
            })}>{children}
          </ButtonGroup>
        </div>
        )}
      </Form>
    </div>
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
    if (disableAllFieldsExceptClocked) return disableAllFieldsExceptClockedFields(fieldMeta, resourceType);

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
