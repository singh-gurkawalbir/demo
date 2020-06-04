import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
import PATCH_SAVE_STATUS from '../../../constants/patchSaveStatus';
import MappingRow from './MappingRow';
import Spinner from '../../Spinner';

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
  helpTextButton: {
    float: 'right',
    padding: 1,
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
const SaveButton = props => {
  const { dataTest, disabled, onSave, label, saveInProgress, onClose } = props;
  const handleBtnClick = useCallback(() => {
    onSave();

    if (onClose) onClose();
  }, [onClose, onSave]);

  return (
    <Button
      data-test={dataTest}
      variant="outlined"
      color="secondary"
      disabled={disabled}
      onClick={handleBtnClick}>
      {saveInProgress ? (
        <>
          <Spinner size={16} />
          Saving
        </>
      ) : (
        <>{label}</>
      )}
    </Button>
  );
};

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
  const [closeOnSave, setCloseOnSave] = useState(false);
  const { mappings = [], saveStatus, changeIdentifier } = useSelector(state =>
    selectors.responseMappings(state, editorId)
  );
  const isDirty = useSelector(state =>
    selectors.responseMappingDirty(state, editorId)
  );
  const saveInProgress = saveStatus === PATCH_SAVE_STATUS.REQUESTED;
  const saveTerminated = [
    PATCH_SAVE_STATUS.COMPLETED,
    PATCH_SAVE_STATUS.FAILED,
  ].includes(saveStatus);
  const helpKey = isImport
    ? 'import.response.mapping'
    : 'lookup.response.mapping';
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

  useEffect(() => {
    if (closeOnSave && saveTerminated) {
      onClose();
    }
  }, [closeOnSave, onClose, saveTerminated]);

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

  const patchSave = useCallback(() => {
    dispatch(actions.responseMapping.save(editorId));
  }, [dispatch, editorId]);
  const handleSave = useCallback(() => {
    patchSave();
  }, [patchSave]);
  const handleClose = () => {
    setCloseOnSave(true);
  };

  const disableSave = disabled || saveInProgress || !isDirty;

  return (
    <ModalDialog show minWidth="md" maxWidth="md" onClose={onClose}>
      <div className={classes.titleSection}>
        <div>Define response mapping</div>
        <Help
          title="Response mapping"
          className={classes.helpTextButton}
          helpKey={helpKey}
          fieldId={helpKey}
        />
      </div>
      <div className={classes.container}>
        <div className={classes.root}>
          <div className={classes.header}>
            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_extract">
              {resourceType === 'imports' ? 'Import' : 'Lookup'} response field
            </Typography>

            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_generate">
              Source record field (New/Existing field)
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
          <SaveButton
            dataTest="saveMapping"
            disabled={disableSave}
            onSave={handleSave}
            saveInProgress={!closeOnSave && saveInProgress}
            label="Save"
          />
          {isDirty && (
            <SaveButton
              dataTest="saveAndCloseMapping"
              disabled={disableSave}
              onSave={handleSave}
              onClose={handleClose}
              saveInProgress={closeOnSave && saveInProgress}
              label="Save and Close"
            />
          )}
          <Button
            variant="text"
            data-test="close"
            disabled={saveInProgress}
            onClick={onClose}>
            {saveTerminated ? 'Close' : 'Cancel'}
          </Button>
        </ButtonGroup>
      </div>
    </ModalDialog>
  );
}
