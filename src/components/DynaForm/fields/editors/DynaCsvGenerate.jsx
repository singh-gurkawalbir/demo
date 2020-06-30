import React, { useState, } from 'react';
import { FormLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../../FieldHelp';
import DynaEditorWithFlowSampleData from '../DynaEditorWithFlowSampleData';

const useStyles = makeStyles(theme => ({
  dynaCsvGenerateWrapper: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  dynaCsvBtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaCsvLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

export default function DynaCsvGenerate(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    label,
    resourceId,
    flowId,
    resourceType,
    disabled,
    helpKey,
    options = {},
  } = props;
  const { fields = {} } = options;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      Object.keys(fields).forEach(key => {
        onFieldChange(`file.csv.${key}`, editorValues[key]);
      });
    }

    handleEditorClick();
  };

  return (
    <>
      {showEditor && (
        <DynaEditorWithFlowSampleData
          title="CSV generator helper"
          id={id + resourceId}
          mode="csv"
          csvEditorType="generate"
          /** rule to be passed as json */
          rule={fields}
          onClose={handleClose}
          disabled={disabled}
          flowId={flowId}
          editorType="csvGenerate"
          resourceId={resourceId}
          resourceType={resourceType}
          fieldId="file.csv"
        />

      )}
      <div className={classes.dynaCsvGenerateWrapper}>
        <FormLabel className={classes.dynaCsvLabel}>{label}</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaCsvBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>

        <FieldHelp {...props} helpKey={helpKey} />
      </div>
    </>
  );
}
