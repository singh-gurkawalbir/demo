import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles }
  from '@material-ui/core';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import getForm from './formMeta';
import DynaForm from '../../../../DynaForm';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useFormContext from '../../../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflow: 'auto',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  helpText: {
    whiteSpace: 'pre-line',
    maxWidth: 450,
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1),
  },

}));

export default function XmlParseRules({ editorId }) {
  const formKey = `xmlParse-${editorId}`;
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const resourceId = useSelector(state => selectors._editor(state, editorId).resourceId);
  const formContext = useFormContext(formKey);

  // Since the form metadata is used only once, we don't need to refresh the
  // metadata cache on rule changes... we just need the original rule to set the
  // starting values.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fieldMeta = useMemo(() => getForm(rule, resourceId), [resourceId]);

  useFormInitWithPermissions({ formKey, disabled, fieldMeta });

  useEffect(() => {
    if (!formContext.value) return;
    const rule = {
      ...formContext.value,
      V0_json: formContext.value.V0_json === 'true',
    };

    dispatch(actions._editor.patchRule(editorId, rule));
  },
  [dispatch, editorId, formContext.value]);

  return (
    <div className={classes.container}>
      <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
    </div>
  );
}
