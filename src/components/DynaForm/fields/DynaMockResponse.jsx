import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import EditorField from './DynaEditor';
import { validateMockResponseField } from '../../../utils/flowDebugger';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  editor: {
    height: 200,
  },
  rawViewWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
}));

export default function DynaMockResponse(props) {
  const {
    id,
    value,
    formKey,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const error = validateMockResponseField(value);

    if (error) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: error}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [dispatch, formKey, id, value]);

  return (
    <EditorField
      {...props}
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      mode="json"
      validateContent={validateMockResponseField}
    />
  );
}
