import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import ActionButton from '../../ActionButton';
import ScriptsIcon from '../../icons/ScriptsIcon';
import DynaTimestampFileName from './DynaTimestampFileName';

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
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };
  const classes = useStyles();

  return (
    <>
      {showEditor && (
      <div>
        <DynaEditorWithFlowSampleData
          title={editorTitle}
          fieldId={id}
          onClose={handleClose}
          editorType="uri"
          flowId={flowId}
          resourceId={resourceId}
          resourceType={resourceType}
          disableEditorV2={disableEditorV2}
          rule={value}
          />
      </div>
      )}
      <div className={classes.dynaRowWrapper}>
        <DynaTimestampFileName
          {...props}
    />
        <ActionButton
          data-test={id}
          onClick={handleEditorClick}
          className={classes.dynaActionButton}>
          <ScriptsIcon />
        </ActionButton>
      </div>
    </>
  );
}
