import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, makeStyles, ButtonGroup, Button } from '@material-ui/core';
// import { useLocation, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { useRouteMatch } from 'react-router-dom';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import MappingRow from './MappingRow';
import SaveButton from './SaveButton';
import RefreshIcon from '../../icons/RefreshIcon';
import IconTextButton from '../../IconTextButton';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';

// const emptySet = [];
const emptyObj = {};
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    width: '100%',
  },
  mappingContainer: {
    height: 'calc(100vh - 180px)',
    padding: theme.spacing(1, 0, 3),
    marginBottom: theme.spacing(1),
    maxWidth: '100%',
    flex: '1 1 0',
  },
  mapCont: {
    width: '0px',
    flex: '1.1 1 0',
  },
  assistantContainer: {
    flex: '1 1 0',
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
    height: 'calc(100% - 32px)',
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
  importMappingButtonGroup: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    padding: '16px 0px',
    '& > button': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
  },

}));
function RefreshButton({className, ...props}) {
  return (
    <IconTextButton
      variant="contained"
      color="secondary"
      className={className}
      {...props}>
      Refresh <RefreshIcon />
    </IconTextButton>
  );
}
const SuiteScriptMapping = (props) => {
  const {disabled, onClose, ssLinkedConnectionId, integrationId, flowId } = props;
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;

  const classes = useStyles();
  const dispatch = useDispatch();
  const showPreviewPane = false;

  const {mappings, lookups, changeIdentifier} = useSelector(state => selectors.suiteScriptMapping(state));
  const {importType, exportType} = useSelector(state => {
    const flow = selectors.suiteScriptFlowDetail(state, {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    });
    const exportType = flow.export.netsuite ? 'netsuite' : flow.export.type;

    return {importType: flow.import && flow.import.type, exportType};
  }, shallowEqual);
  const {status: importSampleDataStatus} = useSelector(state => selectors.getSuiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId}));

  const handleInit = useCallback(() => {
    dispatch(actions.suiteScriptMapping.init({ssLinkedConnectionId, integrationId, flowId}));
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId]);
  const handleRefreshGenerates = useCallback(
    () => {
      dispatch(
        actions.suiteScriptMapping.refreshGenerates()
      );
    },
    [dispatch],
  );

  const extractLabel = `Source Record Field (${exportType === 'netsuite' ? 'Netsuite' : 'Salesforce'})`;
  const generateLabel = `Import Field (${importType === 'netsuite' ? 'Netsuite' : 'Salesforce'})`;
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings,
  ]);
  const handleClose = useCallback(
    () => {
      onClose();
    },
    [onClose],
  );
  const handleDelete = useCallback(key => {
    dispatch(actions.suiteScriptMapping.delete(key));
  }, [dispatch]);
  const handleFieldUpdate = useCallback(
    (_mapping, field, value) => {
      const { key, generate = '', extract = '' } = _mapping;

      if (value === '') {
        if (
          (field === 'extract' && generate === '') ||
          (field === 'generate' &&
            extract === '' &&
            !('hardCodedValue' in _mapping))
        ) {
          handleDelete(key);

          return;
        }
      }

      dispatch(actions.suiteScriptMapping.patchField({field, key, value }));
    },
    [dispatch, handleDelete]
  );

  const patchSettings = useCallback(
    (key, settings) => {
      dispatch(actions.suiteScriptMapping.patchSettings(key, settings));
    },
    [dispatch]
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

    dispatch(actions.suiteScriptMapping.updateLookups(lookupsTmp));
  };
  const handleDrop = useCallback(() => {
    dispatch(actions.suiteScriptMapping.changeOrder(localMappings));
  }, [dispatch, localMappings]);

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

  useEffect(() => {
    handleInit();
    return () => {
      dispatch(actions.suiteScriptMapping.clear());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // update local mapping state when mappings in data layer changes
    if (localChangeIdentifier !== changeIdentifier && mappings) {
      setState({
        localMappings: mappings,
        localChangeIdentifier: changeIdentifier,
      });
    }
  }, [changeIdentifier, localChangeIdentifier, localMappings, mappings]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer, {
          [classes.mapCont]: showPreviewPane,
        })}
        >
        <div className={classes.header}>
          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading, {
              [classes.topHeadingCustomWidth]: showPreviewPane,
            })}>
            {extractLabel}
          </Typography>

          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading)}>
            {generateLabel}
            { importSampleDataStatus !== 'requested' && (
              <RefreshButton
                disabled={disabled}
                onClick={handleRefreshGenerates}
                className={classes.refreshButton}
                data-test="refreshGenerates"
              />
            )}
            {importSampleDataStatus === 'requested' && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
          </Typography>
        </div>

        <div className={classes.mappingsBody}>
          {tableData.map((mapping, index) => (
            <MappingRow
              index={index}
              id={`${mapping.key}-${mapping.rowIdentifier}`}
                // eslint-disable-next-line react/no-array-index-key
              key={`${mapping.key}-${mapping.rowIdentifier}`}
              mapping={mapping}
              onFieldUpdate={handleFieldUpdate}
              disabled={disabled}
              ssLinkedConnectionId={ssLinkedConnectionId}
              integrationId={integrationId}
              flowId={flowId}
              updateLookupHandler={updateLookupHandler}
              patchSettings={patchSettings}
              onDelete={handleDelete}
              onMove={handleMove}
              onDrop={handleDrop}
              isDraggable={!disabled}
              importType={importType}
              />
          ))}
          <MappingRow
            key={`${emptyRowIndex}`}
            index={emptyRowIndex}
            mapping={emptyObj}
            onFieldUpdate={handleFieldUpdate}
            disabled={disabled}
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
            updateLookupHandler={updateLookupHandler}
            patchSettings={patchSettings}
            onDelete={handleDelete}
            isDraggable={false}
            importType={importType}
          />
        </div>
        <ButtonGroup
          className={classes.importMappingButtonGroup}>
          <SaveButton
            disabled={!!(disabled)}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"

          />
          <SaveButton
            variant="outlined"
            color="secondary"
            dataTest="saveAndCloseImportMapping"
            onClose={handleClose}
            disabled={!!(disabled)}
            showOnlyOnChanges
            submitButtonLabel="Save & close"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            // disabled={!!saveInProgress}
            onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>

    </div>
  );
};

export default function SuiteScriptMappingWrapper(props) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [importSampleDataLoaded, setImportSampleDataLoaded] = useState(false);
  const str1 = match.path.match('/(.*)integrations/(.*)/flows/');
  const integrationId = str1[str1.length - 1];
  const str2 = match.path.match('/(.*)suitescript/(.*)/integrations/');
  const ssLinkedConnectionId = str2[str2.length - 1];
  const flowId = match.params && match.params.flowId;

  const {status: importSampleDataStatus, data: importSampleData} = useSelector(state => selectors.getSuiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId}));
  const requestImportSampleData = useCallback(
    () => {
      dispatch(
        actions.suiteScript.importSampleData.request(
          {ssLinkedConnectionId,
            integrationId,
            flowId,
          }
        )
      );
    },
    [dispatch, flowId, integrationId, ssLinkedConnectionId]
  );
  useEffect(() => {
    if (
      !importSampleDataLoaded &&
      (importSampleDataStatus === 'received' || importSampleDataStatus === 'error')
    ) {
      setImportSampleDataLoaded(true);
    }
  }, [importSampleDataStatus, importSampleDataLoaded, setImportSampleDataLoaded]);


  useEffect(() => {
    if (!importSampleData && !importSampleDataLoaded) {
      requestImportSampleData();
    }
  }, [importSampleData, dispatch, requestImportSampleData, importSampleDataLoaded]);
  if (!importSampleDataLoaded) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  return (
    <SuiteScriptMapping {...props} ssLinkedConnectionId={ssLinkedConnectionId} integrationId={integrationId} flowId={flowId} />

  );
}
