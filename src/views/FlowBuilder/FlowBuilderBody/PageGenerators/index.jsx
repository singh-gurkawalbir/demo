import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useHandleAddGenerator, useHandleDelete, useHandleMovePG } from '../../hooks';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import AppBlock from '../../AppBlock';
import itemTypes from '../../itemTypes';
import PageGenerator from '../../PageGenerator';
import { emptyObject } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 0, 3, 3),
    backgroundColor: theme.palette.background.default,
  },
  newPG: {
    marginRight: 50,
  },
}));

export default function PageGenerators({integrationId, flowId}) {
  const handleDelete = useHandleDelete(flowId);
  const classes = useStyles();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;

  const pageGenerators = flow.pageGenerators || [];
  const {
    data: flowErrorsMap,
  } = useSelector(state => selectors.errorMap(state, flowId));
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));

  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));

  const handleMovePG = useHandleMovePG(flowId);
  const handleAddGenerator = useHandleAddGenerator();

  return (
    <div className={classes.generatorContainer}>
      {pageGenerators.map((pg, i) => (
        <PageGenerator
          {...pg}
          onDelete={handleDelete(itemTypes.PAGE_GENERATOR)}
          flowId={flowId}
          integrationId={integrationId}
          openErrorCount={
                      (flowErrorsMap && flowErrorsMap[pg._exportId]) || 0
                    }
          key={
                      pg._exportId ||
                      pg._connectionId ||
                      `${pg.application}${pg.webhookOnly}`
                    }
          index={i}
          isViewMode={isViewMode || isFreeFlow}
          isLast={pageGenerators.length === i + 1}
          onMove={handleMovePG}
                  />
      ))}
      {!pageGenerators.length && (
        <AppBlock
          integrationId={integrationId}
          className={classes.newPG}
          isViewMode={isViewMode || isFreeFlow}
          onBlockClick={handleAddGenerator}
          blockType="newPG"
                  />
      )}
    </div>
  );
}
