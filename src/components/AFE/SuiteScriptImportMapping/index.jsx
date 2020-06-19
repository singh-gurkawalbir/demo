import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, makeStyles, ButtonGroup, Button } from '@material-ui/core'
// import { useLocation, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import MappingRow from './MappingRow';
import MappingSaveButton from '../../ResourceFormFactory/Actions/MappingSaveButton';

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
  },

}));
export default function SuiteScriptImportMapping(props) {
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;

  const {disabled, onClose} = props;
  const classes = useStyles();
  const ssLinkedConnectionId = '5ee899321bac9b4c34de1387';
  const integrationId = '26230';
  const flowId = 'i35026';
  const dispatch = useDispatch();
  const showPreviewPane = false
  const {mappings, changeIdentifier} = useSelector(state => selectors.suiteScriptMapping(state, {ssLinkedConnectionId, integrationId, flowId}));
  const handleInit = useCallback(() => {
    dispatch(actions.suiteScriptMapping.init({ssLinkedConnectionId, integrationId, flowId}));
  }, [dispatch]);
  const extractLabel = 'Source Record Field';
  const generateLabel = 'Import field';
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings,
  ]);
  const handleClose = useCallback(
    () => {
      onClose()
    },
    [onClose],
  );
  const handleDelete = useCallback(key => {
    dispatch(actions.suiteScriptMapping.delete({ssLinkedConnectionId, integrationId, flowId, key}));
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

      dispatch(actions.suiteScriptMapping.patchField({ssLinkedConnectionId, integrationId, flowId, field, key, value}));
    },
    [dispatch, handleDelete]
  );
  const handleDrop = useCallback(() => {
    dispatch(actions.suiteScriptMapping.changeOrder({ssLinkedConnectionId, integrationId, flowId, mappings: localMappings}));
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
  }, [handleInit])
  // console.log('props', props)
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
              // updateLookupHandler={updateLookupHandler}
              // patchSettings={patchSettings}
              // options={options}
              // lookups={lookups}
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
            // updateLookupHandler={updateLookupHandler}
            // patchSettings={patchSettings}
            // options={options}
            // lookups={lookups}
            onDelete={handleDelete}
            isDraggable={false}
          />
        </div>
        <ButtonGroup
          className={classes.importMappingButtonGroup}>
          <MappingSaveButton
            disabled={!!(disabled)}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"
          />
          <MappingSaveButton
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
  )
}
