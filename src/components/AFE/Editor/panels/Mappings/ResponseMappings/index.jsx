import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import FieldMappingForm from './FieldMappingForm';
import { dataAsString } from '../../../../../../utils/editor';

const useStyles = makeStyles(theme => ({
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
  },
  mappingColumn: {
    flex: '1 1 0',
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'column',
    padding: theme.spacing(3, 3, 0),
    display: 'flex',
  },
  mappingTable: {
    height: '100%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1.5),
    alignItems: 'center',
  },
  headerChild: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: theme.spacing(0.5),
    fontFamily: 'Roboto500',
  },
}));
const ResponseMapping = ({ flowId, resourceId, editorId}) => {
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const classes = useStyles();
  const resourceType = useSelector(state => selectors.responseMapping(state).resourceType);

  return (
    <div className={classes.mappingDrawerContent}>
      <div className={classes.mappingColumn}>
        <div className={classes.header}>
          <Typography
            variant="h5"
            className={classes.headerChild}
            key="heading_extract">
            {resourceType === 'imports' ? 'Import response' : 'Lookup response'} field
          </Typography>

          <Typography
            variant="h5"
            className={classes.headerChild}
            key="heading_generate">
            Source record field
          </Typography>
        </div>
        <div className={classes.mappingTable}>
          <FieldMappingForm
            disabled={disabled}
            resourceId={resourceId}
            flowId={flowId} />
        </div>
      </div>
    </div>
  );
};

export default function ResponseMappingWrapper({ editorId }) {
  const dispatch = useDispatch();
  const {flowId,
    resourceId,
    resourceType} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      flowId: e.flowId,
      resourceId: e.resourceId,
      resourceType: e.resourceType,
    };
  }, shallowEqual);
  const mappingStatus = useSelector(state => selectors.responseMapping(state).status);
  const sampleInput = useSelector(state => {
    const input = selectors.responseMappingInput(state, resourceType, resourceId, flowId);

    return dataAsString(input);
  });

  const flowInputData = useSelector(state => {
    const {data} = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
    });

    return dataAsString(data);
  });

  useEffect(() => {
    /** initiate a response mapping init each time user opens */
    dispatch(actions.responseMapping.init({
      flowId,
      resourceId,
      resourceType,
    }));

    return () => {
      // clear the mapping list when component unloads.
      dispatch(actions.responseMapping.clear());
    };
  }, [dispatch, flowId, resourceId, resourceType]);

  useEffect(() => {
    if (mappingStatus === 'received') {
      dispatch(actions.editor.sampleDataReceived(`responseMappings-${resourceId}`, sampleInput));
      dispatch(actions.editor.patchFeatures(editorId, {flowInputData}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingStatus]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load {resourceType === 'exports' ? 'results' : 'response'} mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <ResponseMapping
      editorId={editorId}
      flowId={flowId}
      resourceId={resourceId} />
  );
}
