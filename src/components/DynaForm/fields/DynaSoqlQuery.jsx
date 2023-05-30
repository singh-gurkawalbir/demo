import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch} from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { TextField, FormControl, FormLabel } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FieldHelp from '../FieldHelp';
import ActionButton from '../../ActionButton';
import ScriptsIcon from '../../icons/ScriptsIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { getValidRelativePath } from '../../../utils/routePaths';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';

const useStyles = makeStyles({
  formField: {
    width: '100%',
  },
  dynasoqlFormControl: {
    width: '100%',
    '& .MuiInputBase-multiline': {
      padding: 0,
    },
  },
  dynasoqlLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynasoqlWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
});

export default function DynaSoqlQuery(props) {
  const {
    id,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
    connectionId,
    multiline,
    filterKey,
    formKey,
    flowId,
    resourceId,
    resourceType,
  } = props;
  const query = value && value.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const [soqlQuery, setSoqlQuery] = useState(false);
  const [sObject, setsObject] = useState(true);
  const [queryChanged, setQueryChanged] = useState(true);
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/query/columns`;

  const { data = {} } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey);

  const handleFieldOnBlur = () => {
    setsObject(true);
  };
  const handleSave = useCallback(editorValues => {
    onFieldChange(id, { ...value, query: editorValues.rule });
    setsObject(false);
    setQueryChanged(true);
  }, [id, onFieldChange, value]);

  const handleFieldChange = useCallback(e => {
    handleSave({rule: e.target.value});
  }, [handleSave]);

  useEffect(() => {
    if (query && sObject && queryChanged) {
      dispatch(actions.metadata.request(connectionId, commMetaPath, { query }));
      setSoqlQuery(true);
      setsObject(false);
      setQueryChanged(false);
    }
  }, [commMetaPath, connectionId, dispatch, query, queryChanged, sObject]);
  useEffect(() => {
    if (soqlQuery && data.entityName) {
      onFieldChange(id, { ...value, entityName: data.entityName }, true);
      dispatch(
        actions.metadata.request(
          connectionId,
          `salesforce/metadata/connections/${connectionId}/sObjectTypes/${data.entityName}`
        )
      );
      setSoqlQuery(false);
    }
  }, [
    connectionId,
    data.entityName,
    dispatch,
    id,
    onFieldChange,
    soqlQuery,
    value,
  ]);
  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'sql', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FILTERED_DATA_STAGE,
      onSave: handleSave,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <FormControl variant="standard" className={classes.dynasoqlFormControl}>
      <div className={classes.dynasoqlLabelWrapper}>
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.dynasoqlWrapper}>
        <TextField
          autoComplete="off"
          key={id}
          data-test={id}
          name={name}
          placeholder={placeholder}
          multiline={multiline}
          value={value.query}
          variant="filled"
          onBlur={handleFieldOnBlur}
          className={classes.dynasoqlFormControl}
          onChange={handleFieldChange}
      />
        <ActionButton
          data-test={id}
          onClick={handleEditorClick}>
          <ScriptsIcon />
        </ActionButton>
      </div>
    </FormControl>
  );
}
