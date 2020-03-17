import { useMemo, useCallback, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import responseMappingUtil from '../../../utils/responseMapping';
import getJSONPaths from '../../../utils/jsonPaths';
import ModalDialog from '../../ModalDialog';
import ButtonGroup from '../../ButtonGroup';
import Help from '../../Help';
import ResponseMappingSave from '../../ResourceFormFactory/Actions/ResponseMappingSave';
import PATCH_SAVE_STATUS from '../../../constants/patchSaveStatus';
import MappingRow from './MappingRow';

// TODO Aditya: Convert Response Mapping and Import mapping to re-use same component
// TODO: Azhar once Mapping dialog design is ready make a component
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    minHeight: 450,
  },
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px',
    gridColumnGap: '1%',
    marginBottom: theme.spacing(0.5),
  },
  titleSection: {
    width: '100%',
    '& > div': {
      float: 'left',
    },
  },
  iconButton: {
    float: 'right',
    padding: '1px',
  },
  childHeader: {
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
  },
}));

export default function ResponseMappingDialog(props) {
  const {
    resource,
    resourceIndex,
    flowId,
    resourceType,
    onClose,
    disabled = false,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const editorId = `responseMapping-${resourceId}`;
  const isImport = resourceType === 'imports';
  const { mappings = [], saveStatus, changeIdentifier } = useSelector(state =>
    selectors.responseMappings(state, editorId)
  );
  const saveInProgress = saveStatus === PATCH_SAVE_STATUS.REQUESTED;
  const saveTerminated = [
    PATCH_SAVE_STATUS.COMPLETED,
    PATCH_SAVE_STATUS.FAILED,
  ].includes(saveStatus);
  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      stage: 'responseMappingExtract',
      resourceType: 'imports',
    })
  );

  useEffect(() => {
    if (!extractFields && isImport) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'responseMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, isImport, resourceId]);

  const defaultExtractFields = responseMappingUtil.getResponseMappingDefaultExtracts(
    resourceType
  );
  const handleInit = useCallback(() => {
    dispatch(
      actions.responseMapping.init(editorId, {
        resourceIndex,
        flowId,
      })
    );
  }, [dispatch, editorId, flowId, resourceIndex]);

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  const handleFieldUpdate = useCallback(
    (rowIndex, field, value) => {
      dispatch(
        actions.responseMapping.patchField(editorId, field, rowIndex, value)
      );
    },
    [dispatch, editorId]
  );
  const handleDelete = useCallback(
    rowIndex => {
      dispatch(actions.responseMapping.delete(editorId, rowIndex));
    },
    [dispatch, editorId]
  );
  const tableData = useMemo(() => {
    const rows = (mappings || []).map((value, index) => ({ ...value, index }));

    // add empty row
    rows.push({ index: mappings.length, rowIdentifier: 0 });

    return rows;
  }, [mappings]);
  let formattedExtractFields = defaultExtractFields;

  // Incase of imports , If there is sampledata we show them as suggestions else the default extractFields
  // Incase of Exports ( Lookups ), We always show the default extractFields
  if (isImport && !isEmpty(extractFields)) {
    const extractPaths = getJSONPaths(extractFields);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  return (
    <ModalDialog show minWidth="md" maxWidth="md">
      <div className={classes.titleSection}>
        <div>Define Response Mapping</div>
        <Help
          key="help-responseMapping"
          data-test="help-responseMapping"
          title="Response Mapping"
          className={classes.iconButton}
          helpKey="responseMapping"
          fieldId="responseMappingHelp"
        />
      </div>
      <div className={classes.container}>
        <div className={classes.root}>
          <div className={classes.header}>
            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_extract">
              {resourceType === 'imports' ? 'Import' : 'Lookup'} Response Field
            </Typography>

            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_generate">
              Source Record Field (New/Existing Field)
            </Typography>
          </div>
          <div key={changeIdentifier}>
            {tableData.map(mapping => (
              <MappingRow
                value={mapping}
                key={`row-${mapping.rowIdentifier}-${mapping.index}`}
                extractFields={formattedExtractFields}
                onFieldUpdate={handleFieldUpdate}
                disabled={disabled}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <ButtonGroup>
          <ResponseMappingSave
            id={editorId}
            disabled={disabled || saveInProgress}
            dataTest="saveMapping"
            variant="outlined"
            color="secondary"
          />
          <ResponseMappingSave
            id={editorId}
            disabled={disabled || saveInProgress}
            submitButtonLabel="Save and close"
            dataTest="saveAndCloseMapping"
            onClose={onClose}
            showOnlyOnChanges
            variant="outlined"
            color="secondary"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            disabled={saveInProgress}
            onClick={onClose}>
            {saveTerminated ? 'Close' : 'Cancel'}
          </Button>
        </ButtonGroup>
      </div>
    </ModalDialog>
  );
}
