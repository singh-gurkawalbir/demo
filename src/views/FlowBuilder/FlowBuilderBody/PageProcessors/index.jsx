import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import AppBlock from '../../AppBlock';
import { useHandleAddProcessor, useHandleDelete, useHandleMovePP, useIsDataLoaderFlow, useIsFreeFlowResource, useIsViewMode, useShowAddPageProcessor } from '../../hooks';
import itemTypes from '../../itemTypes';
import PageProcessor from '../../PageProcessor';

const useStyles = makeStyles(theme => ({
  processorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(3),
  },
  newPP: {
    marginLeft: 100,
  },
  dataLoaderHelp: {
    margin: theme.spacing(5, 0, 0, 5),
    maxWidth: 450,
  },
}));
export default function PageProcessors({integrationId, flowId}) {
  const handleDelete = useHandleDelete(flowId);
  const classes = useStyles();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;
  const pageProcessors = flow?.pageProcessors || [];

  const handleAddProcessor = useHandleAddProcessor();
  const handleMovePP = useHandleMovePP(flowId);
  const {
    data: flowErrorsMap,
  } = useSelector(state => selectors.errorMap(state, flowId));
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  const isFreeFlow = useIsFreeFlowResource(flowId);

  const isViewMode = useIsViewMode(integrationId, flowId);

  const isDataLoaderFlow = useIsDataLoaderFlow(flowId);

  const showAddPageProcessor = useShowAddPageProcessor(flowId);

  return (
    <div className={classes.processorContainer}>
      {pageProcessors.map((pp, i) => (
        <PageProcessor
          {...pp}
          onDelete={handleDelete(itemTypes.PAGE_PROCESSOR)}
          flowId={flowId}
          integrationId={integrationId}
          openErrorCount={
                        (flowErrorsMap &&
                          flowErrorsMap[pp._importId || pp._exportId]) ||
                        0
                      }
          key={
                        pp._importId ||
                        pp._exportId ||
                        pp._connectionId ||
                        `${pp.application}-${i}`
                      }
          index={i}
          isViewMode={isViewMode || isFreeFlow}
          isMonitorLevelAccess={isMonitorLevelAccess}
          isLast={pageProcessors.length === i + 1}
          onMove={handleMovePP}
                    />
      ))}
      {!pageProcessors.length && showAddPageProcessor && (
      <AppBlock
        className={classes.newPP}
        integrationId={integrationId}
        isViewMode={isViewMode || isFreeFlow}
        onBlockClick={handleAddProcessor}
        blockType={isDataLoaderFlow ? 'newImport' : 'newPP'}
                    />
      )}
      {!showAddPageProcessor &&
                    isDataLoaderFlow &&
                    pageProcessors.length === 0 && (
                      <Typography variant="h5" className={classes.dataLoaderHelp}>
                        You can add a destination application once you complete the
                        configuration of your data loader.
                      </Typography>
      )}
    </div>
  );
}
