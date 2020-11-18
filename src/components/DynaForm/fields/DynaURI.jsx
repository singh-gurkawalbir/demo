import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActionButton from '../../ActionButton';
import ScriptsIcon from '../../icons/ScriptsIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

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
    display: 'flex',
  },
}));

export default function DynaURI(props) {
  const {
    id,
    onFieldChange,
    value = '',
    editorTitle,
    resourceId,
    resourceType,
    flowId,
    description,
    formKey,
    disableEditorV2 = false,
    enableEditorV2 = false,
  } = props;
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
          formKey={formKey}
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
          enableEditorV2={enableEditorV2}
          />
      </div>

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
          onClick={handleOpenDrawer}
          className={classes.dynaURIActionButton}>
          <ScriptsIcon />
        </ActionButton>
      </div>
    </>
  );
}
