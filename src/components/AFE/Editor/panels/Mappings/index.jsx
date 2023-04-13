import React, { useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import {selectors} from '../../../../../reducers';
import actions from '../../../../../actions';
import TopPanel from '../../../../Mapping/TopPanel';
import DragContainer from '../../../../DragContainer';
import SettingsDrawer from '../../../../Mapping/Settings';
import AutoMapperButton from '../../../../Mapping/AutoMapperButton';
import { dataAsString, getMappingsEditorId } from '../../../../../utils/editor';
import MappingRow from '../../../../Mapping/MappingRow';
import { emptyObject } from '../../../../../constants';
import Mapper2 from './Mapper2';
import NoResultTypography from '../../../../NoResultTypography';
import VirtualizedDragContainer from '../../../../VirtualizedDragContainer';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
    padding: theme.spacing(3, 3, 0),
  },
  mappingColumn: {
    flex: '1 1 0',
    width: 'calc(100% + 24px)',
    overflow: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    marginLeft: -24,
  },
  mappingTable: {
    height: '100%',
    overflow: 'auto',
  },
  autoMapper: {
    margin: theme.spacing(2, 3),
  },
}));
const SortableItemComponent = props => (
  <MappingRow {...props} />
);
const LastRowSortableItemComponent = props => (
  <MappingRow rowData={emptyObject} {...props} />
);
const Mapper1 = ({editorId, flowId, importId, subRecordMappingId}) => {
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const canAutoMap = useSelector(state => {
    if (disabled) {
      return false;
    }
    const generateFields = selectors.mappingGenerates(state, importId, subRecordMappingId);
    const extractFields = selectors.mappingExtracts(state, importId, flowId, subRecordMappingId);

    return generateFields.length > 0 && extractFields.length > 0;
  });
  const classes = useStyles();
  const dispatch = useDispatch();
  const mappings = useSelector(state => selectors.mapping(state).mappings);
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    dispatch(actions.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
  }, [dispatch, mappings]);

  return (
    <div className={classes.mappingDrawerContent}>
      <div className={classes.mappingColumn}>
        <TopPanel flowId={flowId} importId={importId} disabled={disabled} />

        <div className={classes.mappingTable}>
          {mappings.length > 99 ? (
            <VirtualizedDragContainer
              disabled={disabled}
              importId={importId}
              flowId={flowId}
              items={mappings}
              onSortEnd={onSortEnd}
              subRecordMappingId={subRecordMappingId}
              />
          ) : (
            <DragContainer
              disabled={disabled}
              importId={importId}
              flowId={flowId}
              items={mappings}
              SortableItemComponent={SortableItemComponent}
              LastRowSortableItemComponent={LastRowSortableItemComponent}
              onSortEnd={onSortEnd}
              subRecordMappingId={subRecordMappingId}
              />
          )}
          {canAutoMap && (
            <div className={classes.autoMapper}>
              <AutoMapperButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MappingWrapper({ editorId }) {
  const dispatch = useDispatch();
  const {flowId,
    importId,
    subRecordMappingId} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      flowId: e.flowId,
      importId: e.resourceId,
      subRecordMappingId: e.subRecordMappingId,
    };
  }, shallowEqual);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const mappingStatus = useSelector(state => selectors.mapping(state, flowId, importId, subRecordMappingId).status);
  const sampleInput = useSelector(state => {
    const {data} = selectors.getSampleDataContext(state, {
      flowId,
      resourceId: importId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    });

    return dataAsString(data);
  });
  const mappingVersion = useSelector(state => selectors.mappingVersion(state));

  useEffect(() => {
    if (mappingStatus === 'received') {
      dispatch(actions.editor.sampleDataReceived(getMappingsEditorId(importId), sampleInput));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingStatus]);

  if (mappingStatus === 'error') {
    return (<NoResultTypography size="small" >{message.MAPPER2.FAILED_TO_LOAD_MAPPING}</NoResultTypography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <>
      <SettingsDrawer disabled={disabled} />
      {mappingVersion === 2 ? (
        <Mapper2
          editorId={editorId}
          flowId={flowId}
          importId={importId}
          subRecordMappingId={subRecordMappingId}
     />
      )
        : (
          <Mapper1
            editorId={editorId}
            flowId={flowId}
            importId={importId}
            subRecordMappingId={subRecordMappingId}
     />
        )}
    </>
  );
}
