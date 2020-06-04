import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActionButton from '../../ActionButton';
import ScriptsIcon from '../../icons/ScriptsIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';

const useStyles = makeStyles(theme => ({
  dynaURIActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaURIWrapper: {
    flexDirection: 'row !important',
  },
}));

export default function DynaURI(props) {
  const {
    id,
    onFieldChange,
    value,
    editorTitle,
    resourceId,
    resourceType,
    flowId,
    description,
    disableEditorV2 = false,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
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

  return (
    <>
      {showEditor && (
        <div>
          <DynaEditorWithFlowSampleData
            title={editorTitle}
            fieldId={id}
            onClose={handleClose}
            editorType="url"
            flowId={flowId}
            resourceId={resourceId}
            resourceType={resourceType}
            disableEditorV2={disableEditorV2}
            rule={value}
          />
        </div>
      )}
      <div className={classes.dynaURIWrapper}>
        <DynaTextWithFlowSuggestion
          description={description}
          key={`text-${id}`}
          id={id}
          value={value}
          {...props}
        />
        <ActionButton
          data-test={id}
          onClick={handleEditorClick}
          className={classes.dynaURIActionButton}>
          <ScriptsIcon />
        </ActionButton>
      </div>
    </>
  );
}
