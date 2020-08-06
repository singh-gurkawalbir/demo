import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const handleEditorClick = useCallback(() => {
    history.push(`${match.url}/${id}`);
  }, [history, id, match.url]);
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
