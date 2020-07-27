import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import DynaFormGenerator from './DynaFormGenerator';

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
    showValidationBeforeTouched,
    fieldMeta,
    full,
    formKey,
    autoFocus,
    ...rest
  } = props;
  const classes = useStyles();
  const { fieldMap } = fieldMeta;
  let { layout } = fieldMeta;
  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);
  const formRef = useRef();
  useEffect(() => {
    if (!autoFocus) return;

    const firstInput = formRef.current?.querySelector?.('input');

    if (firstInput?.focus) {
      setTimeout(() => firstInput.focus(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current]);

  if (!formKey) return null;

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
  }
  return (
    <>
      <div ref={formRef} className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKey}
        />
      </div>
    </>
  );
};

export default DynaForm;
