import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import actions from '../../../actions';
import mappingUtil from '../../../utils/mapping';
import * as selectors from '../../../reducers';
import IconTextButton from '../../IconTextButton';
import { adaptorTypeMap } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import Spinner from '../../Spinner';
import ButtonGroup from '../../ButtonGroup';
import MappingSaveButton from '../../ResourceFormFactory/Actions/MappingSaveButton';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../NetSuiteMappingAssistant';
import MappingRow from './MappingRow';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    width: '100%',
  },
  mappingContainer: {
    height: `calc(100vh - 180px)`,
    padding: theme.spacing(1, 0, 3),
    marginBottom: theme.spacing(1),
    maxWidth: '100%',
    flex: '1 1 0',
  },
  mapCont: {
    width: '0px',
    flex: `1.1 1 0`,
  },
  assistantContainer: {
    flex: `1 1 0`,
    width: '0px',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(0, 0, 0, 1),
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  child: {
    '& + div': {
      width: '100%',
    },
  },
  childHeader: {
    width: '46%',
    '& > div': {
      width: '100%',
    },
  },
  mappingsBody: {
    height: `calc(100% - 32px)`,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  spinner: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
  topHeading: {
    fontFamily: 'Roboto500',
  },
}));
const emptyMappingRow = {};

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    application,
    generateFields = [],
    extractFields = [],
    resource = {},
    disabled,
    optionalHanlder,
    isExtractsLoading,
    isGeneratesLoading,
    isGenerateRefreshSupported,
    onClose,
    options = {},
  } = props;
  const { sObjectType, connectionId, recordType } = options;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    fetchSalesforceSObjectMetadata,
    refreshGenerateFields,
    refreshExtractFields,
  } = optionalHanlder;
  const {
    mappings,
    lookups,
    changeIdentifier,
    previewData,
    lastModifiedUId,
    salesforceMasterRecordTypeId,
    showSalesforceNetsuiteAssistant,
  } = useSelector(state => selectors.mapping(state, editorId));
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;

  useEffect(() => {
    // update local mapping state when mappings in data layer changes
    if (localChangeIdentifier !== changeIdentifier)
      setState({
        localMappings: mappings,
        localChangeIdentifier: changeIdentifier,
      });
  }, [changeIdentifier, localChangeIdentifier, localMappings, mappings]);

  const { saveCompleted } = useSelector(state =>
    selectors.mappingSaveProcessTerminate(state, editorId)
  );
  const tableData = useMemo(
    () =>
      (localMappings || []).map((value, index) => {
        const obj = { ...value };

        obj.index = index;

        if (obj.hardCodedValue) {
          obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
        }

        return obj;
      }),
    [localMappings]
  );
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings.length,
  ]);
  const handleFieldUpdate = useCallback(
    (_mapping, field, value) => {
      const { uId, generate = '', extract = '' } = _mapping;

      if (value === '') {
        if (
          (field === 'extract' && generate === '') ||
          (field === 'generate' &&
            extract === '' &&
            !('hardCodedValue' in _mapping))
        ) {
          dispatch(actions.mapping.delete(editorId, uId));

          return;
        }
      }

      if (
        field === 'generate' &&
        application === adaptorTypeMap.SalesforceImport &&
        value &&
        value.indexOf('_child_') > -1
      ) {
        const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);

        if (childRelationshipField) {
          const { childSObject, relationshipName } = childRelationshipField;

          dispatch(
            actions.mapping.patchIncompleteGenerates(
              editorId,
              uId,
              relationshipName
            )
          );
          fetchSalesforceSObjectMetadata(childSObject);
        }
      }

      dispatch(actions.mapping.patchField(editorId, field, uId, value));
    },
    [
      application,
      dispatch,
      editorId,
      fetchSalesforceSObjectMetadata,
      generateFields,
    ]
  );
  const patchSettings = useCallback(
    (uId, settings) => {
      dispatch(actions.mapping.patchSettings(editorId, uId, settings));
    },
    [dispatch, editorId]
  );
  const handleDelete = uId => {
    dispatch(actions.mapping.delete(editorId, uId));
  };

  const generateLabel = mappingUtil.getGenerateLabelForMapping(
    application,
    resource
  );
  const updateLookupHandler = (lookupOps = []) => {
    let lookupsTmp = [...lookups];
    // Here lookupOPs will be an array of lookups and actions. Lookups can be added and delted simultaneously from settings.

    lookupOps.forEach(({ isDelete, obj }) => {
      if (isDelete) {
        lookupsTmp = lookupsTmp.filter(lookup => lookup.name !== obj.name);
      } else {
        const index = lookupsTmp.findIndex(lookup => lookup.name === obj.name);

        if (index !== -1) {
          lookupsTmp[index] = obj;
        } else {
          lookupsTmp.push(obj);
        }
      }
    });

    dispatch(actions.mapping.updateLookup(editorId, lookupsTmp));
  };

  const handleSalesforceAssistantFieldClick = useCallback(
    meta => {
      if (lastModifiedUId)
        dispatch(
          actions.mapping.patchField(
            editorId,
            'generate',
            lastModifiedUId,
            meta.id
          )
        );
    },
    [dispatch, editorId, lastModifiedUId]
  );
  const handleNetSuiteAssistantFieldClick = useCallback(
    meta => {
      if (lastModifiedUId)
        dispatch(
          actions.mapping.patchField(
            editorId,
            'generate',
            lastModifiedUId,
            meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id
          )
        );
    },
    [dispatch, editorId, lastModifiedUId]
  );
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleDrop = useCallback(() => {
    dispatch(actions.mapping.changeOrder(editorId, localMappings));
  }, [dispatch, editorId, localMappings]);
  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const mappingsCopy = [...localMappings];
      const dragItem = mappingsCopy[dragIndex];

      mappingsCopy.splice(dragIndex, 1);
      mappingsCopy.splice(hoverIndex, 0, dragItem);

      setState({
        ...state,
        localMappings: mappingsCopy,
      });
    },
    [localMappings, state]
  );
  const handlePreviewClick = () => {
    dispatch(actions.mapping.requestPreview(editorId));
  };

  function RefreshButton(props) {
    return (
      <IconTextButton
        variant="contained"
        color="secondary"
        className={classes.refreshButton}
        {...props}>
        Refresh <RefreshIcon />
      </IconTextButton>
    );
  }

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer, {
          [classes.mapCont]: showSalesforceNetsuiteAssistant,
        })}
        key={`mapping-${editorId}`}>
        <div className={classes.header}>
          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading, {
              [classes.topHeadingCustomWidth]: showSalesforceNetsuiteAssistant,
            })}>
            Source Record Field
            {!isExtractsLoading && (
              <RefreshButton
                disabled={disabled}
                onClick={refreshExtractFields}
                data-test="refreshExtracts"
              />
            )}
            {isExtractsLoading && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
          </Typography>

          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading)}>
            {generateLabel}
            {isGenerateRefreshSupported && !isGeneratesLoading && (
              <RefreshButton
                disabled={disabled}
                onClick={refreshGenerateFields}
                data-test="refreshGenerates"
              />
            )}
            {isGeneratesLoading && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
          </Typography>
        </div>

        <div className={classes.mappingsBody} key={`${editorId}`}>
          <DndProvider backend={HTML5Backend}>
            {tableData.map((mapping, index) => (
              <MappingRow
                index={index}
                id={`${mapping.uId}-${mapping.rowIdentifier}`}
                // eslint-disable-next-line react/no-array-index-key
                key={`${mapping.uId}-${mapping.rowIdentifier}`}
                mapping={mapping}
                extractFields={extractFields}
                onFieldUpdate={handleFieldUpdate}
                generateFields={generateFields}
                disabled={disabled}
                updateLookupHandler={updateLookupHandler}
                patchSettings={patchSettings}
                application={application}
                options={options}
                lookups={lookups}
                onDelete={handleDelete}
                onMove={handleMove}
                onDrop={handleDrop}
                isDraggable={!disabled}
              />
            ))}
          </DndProvider>
          <MappingRow
            key={`${emptyRowIndex}`}
            index={emptyRowIndex}
            mapping={emptyMappingRow}
            extractFields={extractFields}
            onFieldUpdate={handleFieldUpdate}
            generateFields={generateFields}
            disabled={disabled}
            updateLookupHandler={updateLookupHandler}
            patchSettings={patchSettings}
            application={application}
            options={options}
            lookups={lookups}
            onDelete={handleDelete}
            isDraggable={false}
          />
        </div>
        <ButtonGroup>
          {showSalesforceNetsuiteAssistant && (
            <Button
              variant="text"
              data-test="preview"
              onClick={handlePreviewClick}>
              Preview
            </Button>
          )}
          <MappingSaveButton
            id={editorId}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"
          />
          <MappingSaveButton
            id={editorId}
            variant="outlined"
            color="secondary"
            dataTest="saveAndCloseImportMapping"
            onClose={handleClose}
            showOnlyOnChanges
            submitButtonLabel="Save & Close"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            onClick={handleClose}>
            {saveCompleted ? 'Close' : 'Cancel'}
          </Button>
        </ButtonGroup>
      </div>
      {showSalesforceNetsuiteAssistant && (
        <div className={classes.assistantContainer}>
          {sObjectType && (
            <SalesforceMappingAssistant
              style={{
                width: '100%',
                height: '100%',
              }}
              connectionId={connectionId}
              sObjectType={sObjectType}
              sObjectLabel={sObjectType}
              layoutId={salesforceMasterRecordTypeId}
              onFieldClick={handleSalesforceAssistantFieldClick}
              data={previewData && previewData.data}
            />
          )}
          {recordType && (
            <NetSuiteMappingAssistant
              style={{
                width: '100%',
                height: '100%',
              }}
              netSuiteConnectionId={connectionId}
              netSuiteRecordType={recordType}
              onFieldClick={handleNetSuiteAssistantFieldClick}
              data={previewData && previewData.data}
            />
          )}
        </div>
      )}
    </div>
  );
}
