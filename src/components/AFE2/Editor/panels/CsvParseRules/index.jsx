import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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
    overflowY: 'auto',
    height: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
}));

export default function CsvParseRules({ editorId }) {
  const formKey = `csvParse-${editorId}`;
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const { resourceId, resourceType } = useSelector(state => {
    const editor = selectors._editor(state, editorId);

    return {
      resourceId: editor.resourceId,
      resourceType: editor.resourceType,
    };
  }, shallowEqual);
  const formContext = useFormContext(formKey);

  // Since the form metadata is used only once, we don't need to refresh the
  // metadata cache on rule changes... we just need the original rule to set the
  // starting values.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fieldMeta = useMemo(() => getForm({...rule, resourceId, resourceType}), [resourceId]);

  useFormInitWithPermissions({
    formKey,
    disabled,
    optionsHandler: fieldMeta?.optionsHandler,
    fieldMeta,
  });

  // any time the form value changes, we dispatch an action to update the
  // editor state with the current form value.
  useEffect(() => {
    if (!formContext.value) return;
    const rule = formContext.value;

    dispatch(actions._editor.patchRule(editorId, rule));
  },
  [dispatch, editorId, formContext.value]);

  return (
    <div className={classes.container}>
      <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
    </div>
  );
}
