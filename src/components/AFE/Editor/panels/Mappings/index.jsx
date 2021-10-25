import React, { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import {useDispatch, useSelector, shallowEqual } from 'react-redux';
import {selectors} from '../../../../../reducers';
import Spinner from '../../../../Spinner';
import actions from '../../../../../actions';
import TopPanel from '../../../../Mapping/TopPanel';
import DragContainer from '../../../../Mapping/DragContainer';
import SettingsDrawer from '../../../../Mapping/Settings';
import AutoMapperButton from '../../../../Mapping/AutoMapperButton';
import { dataAsString } from '../../../../../utils/editor';

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

const Mapping = ({editorId, flowId, importId, subRecordMappingId}) => {
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

  return (
    <>
      <SettingsDrawer disabled={disabled} />
      <div className={classes.mappingDrawerContent}>
        <div className={classes.mappingColumn}>
          <TopPanel dataPublic flowId={flowId} importId={importId} disabled={disabled} />

          <div className={classes.mappingTable}>
            <DragContainer
              disabled={disabled}
              importId={importId}
              flowId={flowId}
              subRecordMappingId={subRecordMappingId}
              />
            {canAutoMap && (
            <div className={classes.autoMapper}>
              <AutoMapperButton />
            </div>
            )}
          </div>
        </div>
      </div>
    </>
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

  useEffect(() => {
    if (mappingStatus === 'received') {
      dispatch(actions.editor.sampleDataReceived(`mappings-${importId}`, sampleInput));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingStatus]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <Mapping
      editorId={editorId}
      flowId={flowId}
      importId={importId}
      subRecordMappingId={subRecordMappingId}
     />
  );
}
