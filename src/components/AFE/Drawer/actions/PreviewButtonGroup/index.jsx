import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { OutlinedButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaCheckbox from '../../../../DynaForm/fields/checkbox/DynaCheckbox';
import ActionGroup from '../../../../ActionGroup';
import ButtonWithTooltip from '../../../../Buttons/ButtonWithTooltip';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  previewButtonGroup: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function PreviewButtonGroup({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const autoEvaluate = useSelector(state => selectors.editor(state, editorId).autoEvaluate);
  const {saveInProgress, disablePreview} = useSelector(state => {
    const {saveStatus, disablePreview} = selectors.editor(state, editorId);

    return { saveInProgress: saveStatus === 'requested', disablePreview};
  }, shallowEqual);

  const handlePreview = () => dispatch(actions.editor.previewRequest(editorId));
  const handleToggle = () => dispatch(actions.editor.toggleAutoPreview(editorId));

  return (
    <ActionGroup className={classes.previewButtonGroup}>
      <DynaCheckbox
        id="disableAutoPreview"
        onFieldChange={handleToggle}
        disabled={saveInProgress}
        label="Auto preview"
        value={autoEvaluate}
        isLoggable
        />
      {!autoEvaluate && (
        <ButtonWithTooltip
          tooltipProps={{title: disablePreview ? message.AFE_EDITOR_PANELS_INFO.EDITOR_PREVIEW_DISABLED : undefined}}>
          <OutlinedButton
            color="primary"
            data-test="previewEditorResult"
            disabled={saveInProgress || disablePreview}
            onClick={handlePreview}>
            Preview
          </OutlinedButton>
        </ButtonWithTooltip>
      )}
    </ActionGroup>
  );
}
