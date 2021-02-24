import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import DynaFormGenerator from './DynaFormGenerator';
import { selectors } from '../../reducers';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    maxHeight: '100%',
    // overflowY: 'auto',
    // padding: theme.spacing(1),
    border: 'none',
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  Accordion: {
    width: '100%',
    overflow: 'hidden',
  },
  actions: {
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  resourceFormButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const key = 'key';

const DynaForm = props => {
  const {
    className,
    formKey,
    autoFocus,
    ...rest
  } = props;
  const classes = useStyles();

  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);
  const formRef = useRef();

  // TODO: deprecate this code no one is using it
  useEffect(() => {
    if (!autoFocus) return;

    const firstInput = formRef.current?.querySelector?.('input');

    if (firstInput?.focus) {
      setTimeout(() => firstInput.focus(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current]);

  const fieldMeta = useSelector(state => selectors.formState(state, formKey)?.fieldMeta, shallowEqual);

  const remountKey = useSelector(state => selectors.formRemountKey(state, formKey)) || key;

  if (!formKey || !fieldMeta) return null;
  const {layout, fieldMap} = fieldMeta;

  if (!fieldMap) return null;

  return (
    <>
      <div ref={formRef} className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKey}
          key={remountKey}
        />
      </div>
    </>
  );
};

export default DynaForm;
