import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EditorField from '../DynaEditor';
import { validateMockOutputField } from '../../../../utils/flowDebugger';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

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

export default function MockOutputEditorField(props) {
  const {id, formKey, resourceType, resourceId, flowId, value} = props;

  const history = useHistory();
  const match = useRouteMatch();
  const classes = useStyles();
  const dispatch = useDispatch();

  const isPreviewPanelAvailableForResource = useSelector(state =>
    // Returns a bool whether the resource has a preview panel or not
    selectors.isPreviewPanelAvailableForResource(
      state,
      resourceId,
      resourceType,
      flowId
    )
  );

  const expandMode = isPreviewPanelAvailableForResource ? 'drawer' : 'modal';

  useEffect(() => {
    const error = validateMockOutputField(value);

    if (error) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: error}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [dispatch, formKey, id, value]);

  const handleExpandDrawer = useCallback(() => {
    const { formKey, id } = props;

    history.push(`${buildDrawerUrl({
      path: drawerPaths.EXPORT_MOCK_OUTPUT,
      baseUrl: match.url,
      params: { formKey, fieldId: id },
    })}`);
  }, [history, match.url, props]);

  return (
    <EditorField
      {...props}
      expandMode={expandMode}
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      customHandleEditorClick={expandMode === 'drawer' && handleExpandDrawer}
      validateContent={validateMockOutputField}
      mode="json"
    />
  );
}
