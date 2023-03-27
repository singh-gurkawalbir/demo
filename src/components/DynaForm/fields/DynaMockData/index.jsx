import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditorField from '../DynaEditor';
import { validateMockDataField } from '../../../../utils/flowDebugger';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { selectors } from '../../../../reducers';
import PopulateWithPreviewData from '../../../PopulateWithPreviewData';
import ActionGroup from '../../../ActionGroup';
import CeligoDivider from '../../../CeligoDivider';

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
  modalTitle: {
    display: 'flex',
    wordBreak: 'normal !important',
    alignItems: 'center',
  },
  referencesFullscreenAction: {
    '&> :not(:last-child)': {
      marginRight: 0,
    },
    '& .MuiButtonBase-root': {
      padding: 0,
    },
  },
}));

function ModalTitle({
  label,
  formKey,
  resourceId,
  resourceType,
  flowId,
}) {
  const classes = useStyles();

  return (
    <div className={classes.modalTitle}>
      {label}
      {
        resourceType === 'imports' &&
        (
          <ActionGroup position="right" className={classes.referencesFullscreenAction}>
            <PopulateWithPreviewData
              flowId={flowId}
              formKey={formKey}
              resourceId={resourceId}
              resourceType={resourceType} />
            <CeligoDivider />
          </ActionGroup>
        )
      }
    </div>
  );
}

export default function MockDataEditorField(props) {
  const { resourceType, resourceId, flowId } = props;

  const history = useHistory();
  const match = useRouteMatch();
  const classes = useStyles();

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

  const handleExpandDrawer = useCallback(() => {
    const { formKey, id } = props;

    history.push(`${buildDrawerUrl({
      path: drawerPaths.RESOURCE_MOCK_DATA,
      baseUrl: match.url,
      params: { formKey, fieldId: id },
    })}`);
  }, [history, match.url, props]);

  const validateContent = useCallback(value =>
    validateMockDataField(resourceType, value),
  [resourceType]);

  return (
    <EditorField
      {...props}
      modalTitle={<ModalTitle {...props} />}
      expandMode={expandMode}
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      customHandleEditorClick={expandMode === 'drawer' && handleExpandDrawer}
      validateContent={validateContent}
      mode="json"
    />
  );
}
