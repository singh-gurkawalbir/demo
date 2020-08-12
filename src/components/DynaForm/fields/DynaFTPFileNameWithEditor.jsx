import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import ActionButton from '../../ActionButton';
import ScriptsIcon from '../../icons/ScriptsIcon';
import DynaTimestampFileName from './DynaTimestampFileName';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

const useStyles = makeStyles(theme => ({
  dynaActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaRowWrapper: {
    flexDirection: 'row !important',
  },
}));

export default function DynaFTPFileNameWithEditor(props) {
  const {editorTitle, id, flowId, resourceId, resourceType, value, onFieldChange, disableEditorV2 = false} = props;
  const classes = useStyles();
  const handleOpenDrawer = usePushRightDrawer(id);
  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }
  }, [id, onFieldChange]);

  return (
    <>
      <div>
        <DynaEditorWithFlowSampleData
          title={editorTitle}
          fieldId={id}
          onSave={handleSave}
          editorType="uri"
          flowId={flowId}
          resourceId={resourceId}
          resourceType={resourceType}
          disableEditorV2={disableEditorV2}
          rule={value}
          path={id}
          />
      </div>
      <div className={classes.dynaRowWrapper}>
        <DynaTimestampFileName
          {...props}
    />
        <ActionButton
          data-test={id}
          onClick={handleOpenDrawer}
          className={classes.dynaActionButton}>
          <ScriptsIcon />
        </ActionButton>
      </div>
    </>
  );
}
