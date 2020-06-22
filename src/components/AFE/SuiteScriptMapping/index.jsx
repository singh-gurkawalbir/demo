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
export default function SuiteScriptMapping(props) {
  const {disabled, onClose } = props;
  const match = useRouteMatch();
  const str1 = match.path.match('/(.*)integrations/(.*)/flows/');
  const integrationId = str1[str1.length - 1];
  const str2 = match.path.match('/(.*)suitescript/(.*)/integrations/');
  const ssLinkedConnectionId = str2[str2.length - 1];
  const flowId = match.params && match.params.flowId;
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;


  const classes = useStyles();
  const dispatch = useDispatch();
  const showPreviewPane = false;
  const {mappings, lookups, changeIdentifier} = useSelector(state => selectors.suiteScriptMapping(state, {ssLinkedConnectionId, integrationId, flowId}));
  const {importType, exportType} = useSelector(state => {
    const flows = selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    });
    const selectedFlow = flows && flows.find(flow => flow._id === flowId);
    const exportType = selectedFlow.export.netsuite ? 'netsuite' : selectedFlow.export.type;

    return {importType: selectedFlow.import && selectedFlow.import.type, exportType};
  }, shallowEqual);

  const handleInit = useCallback(() => {
    dispatch(actions.suiteScriptMapping.init({ssLinkedConnectionId, integrationId, flowId}));
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId]);
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
    dispatch(actions.suiteScriptMapping.delete({ ssLinkedConnectionId, integrationId, flowId, key }));
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId]);
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

      dispatch(actions.suiteScriptMapping.patchField({ ssLinkedConnectionId, integrationId, flowId, field, key, value }));
    },
    [dispatch, flowId, handleDelete, integrationId, ssLinkedConnectionId]
  );
  const patchSettings = useCallback(
    (key, settings) => {
      dispatch(actions.suiteScriptMapping.patchSettings({ ssLinkedConnectionId, integrationId, flowId, key, settings }));
    },
    [dispatch, flowId, integrationId, ssLinkedConnectionId]
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

    dispatch(actions.suiteScriptMapping.updateLookups({ ssLinkedConnectionId, integrationId, flowId, lookups: lookupsTmp }));
  };
  const handleDrop = useCallback(() => {
    dispatch(actions.suiteScriptMapping.changeOrder({ssLinkedConnectionId, integrationId, flowId, mappings: localMappings}));
  }, [dispatch, flowId, integrationId, localMappings, ssLinkedConnectionId]);

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
  }, [handleInit]);
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
          />
        </div>
        <ButtonGroup
          className={classes.importMappingButtonGroup}>
          <SaveButton
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
            disabled={!!(disabled)}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"

          />
          <SaveButton
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
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
}
