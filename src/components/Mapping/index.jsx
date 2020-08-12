import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {selectors} from '../../reducers';
import actions from '../../actions';
import Spinner from '../Spinner';
import SpinnerWrapper from '../SpinnerWrapper';
// import MappingRow from './MappingRow';
import TopPanel from './TopPanel';
import MappingRow from './MappingRow';
import ButtonPanel from './ButtonPanel';
import PreviewPanel from './PreviewPanel';

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
    textAlign: 'center',
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

}));
const Mapping = props => {
  const {flowId, resourceId, subRecordMappingId, disabled, onClose} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;
  const {
    mappings,
    changeIdentifier,
  } = useSelector(state => selectors.mapping(state));

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
  const handleDrop = useCallback(() => {
    dispatch(actions.mapping.changeOrder(localMappings));
  }, [dispatch, localMappings]);

  useEffect(() => {
    // update local mapping state when mappings in data layer changes
    if (localChangeIdentifier !== changeIdentifier) {
      setState({
        localMappings: mappings,
        localChangeIdentifier: changeIdentifier,
      });
    }
  }, [changeIdentifier, localChangeIdentifier, localMappings, mappings]);
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings.length,
  ]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer, {
          // [classes.mapCont]: mappingPreviewType,
        })}>
        <TopPanel
          flowId={flowId}
          resourceId={resourceId}
          disabled={disabled}
        />

        <div className={classes.mappingsBody}>
          {tableData.map((mapping, index) => (
            <MappingRow
              index={index}
              id={`${mapping.key}-${mapping.rowIdentifier}`}
              key={`${mapping.key}-${mapping.rowIdentifier}`}
              mapping={mapping}
              disabled={disabled}
              onMove={handleMove}
              onDrop={handleDrop}
              isDraggable={!disabled}
              resourceId={resourceId}
              flowId={flowId}
              subRecordMappingId={subRecordMappingId}
              />
          ))}
          <MappingRow
            key="newMappingRow"
            index={emptyRowIndex}
            mapping={emptyObj}
            disabled={disabled}
            isDraggable={false}
            resourceId={resourceId}
            flowId={flowId}
            subRecordMappingId={subRecordMappingId}
          />
        </div>
        <ButtonPanel
          flowId={flowId}
          importId={resourceId}
          disabled={disabled}
          onClose={onClose}
           />
      </div>
      <PreviewPanel
        resourceId={resourceId}
        disabled={disabled}
      />
    </div>
  );
};

export default function MappingWrapper(props) {
  const {
    flowId,
    resourceId,
    subRecordMappingId,
  } = props;
  const dispatch = useDispatch();
  const mappingStatus = useSelector(state => selectors.mapping(state, flowId, resourceId, subRecordMappingId).status);

  useEffect(() => {
    dispatch(actions.mapping.init({
      flowId,
      resourceId,
      subRecordMappingId,
    }));

    return () => {
      dispatch(actions.mapping.clear());
    };
  }, [dispatch, flowId, resourceId, subRecordMappingId]);

  if (mappingStatus !== 'received') {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <Mapping {...props} />
  );
}
