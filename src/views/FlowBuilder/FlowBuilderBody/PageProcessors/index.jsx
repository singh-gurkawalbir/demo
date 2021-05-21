import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import AppBlock from '../../AppBlock';
import { useHandleAddProcessor, useHandleDelete, useHandleMovePP } from '../../hooks';
import itemTypes from '../../itemTypes';
import PageProcessor from '../../PageProcessor';

const useStyles = makeStyles(theme => ({
  processorContainer: {
    '& > ul': {
      display: 'flex',
      alignItems: 'flex-start',
      paddingRight: theme.spacing(3),
      marginInlineStart: 0,
      marginBlockStart: 0,
      paddingInlineStart: 0,
      marginBlockEnd: 0,
      listStyleType: 'none',
      '& > li': {
        listStyle: 'none',
      },
    },
  },
  newPP: {
    marginLeft: 100,
  },
  dataLoaderHelp: {
    margin: theme.spacing(5, 0, 0, 5),
    maxWidth: 450,
  },
  dottedLine: {
    width: '100%',
    borderBottom: `3px dotted ${theme.palette.divider}`,
    top: 86,
    position: 'relative',
  },
}));

const SortableItem = SortableElement(({ value }) => (<li>{value}</li>));
const SortableList = SortableContainer(({ pageProcessors, handleDelete, flowId, integrationId, flowErrorsMap, isViewMode, isMonitorLevelAccess }) => (
  <ul>
    {pageProcessors.map((pp, i) => (
      <SortableItem
        index={i}
        key={
          pp._importId ||
          pp._exportId ||
          pp._connectionId ||
          `${pp.application}-${i}`
        }
        value={
         (
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
             index={i}
             isViewMode={isViewMode}
             isMonitorLevelAccess={isMonitorLevelAccess}
             isLast={pageProcessors.length === i + 1}
          // onMove={handleMovePP}
        />
         )
       } />

    ))}
  </ul>
));
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
  const handleSortEnd = useHandleMovePP(flowId);
  // const handleSortEnd = (startIndex, endIndex) => {
  // console.log('111', startIndex, endIndex);
  // };
  const {
    data: flowErrorsMap,
  } = useSelector(state => selectors.errorMap(state, flowId));
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));

  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));

  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));

  const showAddPageProcessor = useSelector(state => selectors.shouldShowAddPageProcessor(state, flowId));

  return (
    <div className={classes.processorContainer}>
      <div className={classes.dottedLine} />
      <SortableList
        onSortEnd={handleSortEnd}
        helperClass={classes.sortableHelper}
        pageProcessors={pageProcessors}
        handleDelete={handleDelete}
        flowId={flowId}
        integrationId={integrationId}
        flowErrorsMap={flowErrorsMap}
        isMonitorLevelAccess={isMonitorLevelAccess}
        isViewMode={isViewMode || isFreeFlow}
        axis="x"
      />
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
