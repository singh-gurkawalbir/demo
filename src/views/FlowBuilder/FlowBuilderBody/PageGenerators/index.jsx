import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useHandleAddGenerator, useHandleDelete, useHandleMovePG } from '../../hooks';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import AppBlock from '../../AppBlock';
import itemTypes from '../../itemTypes';
import PageGenerator from '../../PageGenerator';
import { emptyObject } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  generatorContainer: {
    padding: theme.spacing(0, 0, 3, 3),
    backgroundColor: theme.palette.background.default,
    '& > ul': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginInlineStart: 0,
      marginBlockStart: 0,
      paddingInlineStart: 0,
      marginBlockEnd: 0,
      listStyleType: 'none',
      '& > li': {
        listStyle: 'none',
        // '&::after': {
        //   display: 'inline-block',
        //   content: '""',
        //   borderTop: `3px dotted ${theme.palette.divider}`,
        //   width: '100%',
        //   /* margin: 0 1rem; */
        //   transform: 'translateY(-1rem)',
        //   position: 'relative',
        //   top: '-194px',
        //   right: '0px',
        // },
      },
      // '& > li::after': {
      //   display: 'inline-block',
      //   content: '',
      //   borderTop: '.3rem solid black',
      //   width: '100%',
      //   /* margin: 0 1rem; */
      //   transform: 'translateY(-1rem)',
      //   position: 'relative',
      //   top: '-194px',
      //   right: '0px',
      // },
    },
  },
  newPG: {
    marginRight: 50,
  },
  dottedLine: {
    width: '100%',
    borderBottom: `3px dotted ${theme.palette.divider}`,
    // top: 86,
    position: 'relative',
    transform: 'rotate(-90deg)',
  },
  lineContainer: {
    width: '100%',
    height: '100%',
    '& > div:first-child': {
      position: 'absolute',
      width: '450px;',
      justifyContent: 'space-between',
      // width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '& > div': {
        borderTop: `3px dotted ${theme.palette.divider}`,
        width: '100%',
        height: 1,
      },
    },
  },
}));
const SortableItem = SortableElement(({ value }) => (<li>{value}</li>));

const SortableList = SortableContainer(({ pageGenerators, handleDelete, flowId, integrationId, flowErrorsMap, isViewMode, handleMovePG }) => (
  <ul>
    {pageGenerators.map((pg, i) => (
      <SortableItem
        index={i}
        key={
          pg._exportId ||
          pg._connectionId ||
          `${pg.application}${pg.webhookOnly}`
        }
        value={
      (
        <PageGenerator
          {...pg}
          onDelete={handleDelete(itemTypes.PAGE_GENERATOR)}
          flowId={flowId}
          integrationId={integrationId}
          openErrorCount={
            (flowErrorsMap && flowErrorsMap[pg._exportId]) || 0
          }
          index={i}
          isViewMode={isViewMode}
          isLast={pageGenerators.length === i + 1}
          onMove={handleMovePG}
                  />
      )
    }
    />
    ))}
  </ul>
));
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
      <div className={classes.lineContainer}>
        <div className={classes.line}>
          {pageGenerators.map((pg, i) => (<div key={i} className="subLine" />))}
        </div>
      </div>
      <SortableList
        axis="y"
        pageGenerators={pageGenerators}
        handleDelete={handleDelete}
        flowId={flowId}
        integrationId={integrationId}
        flowErrorsMap={flowErrorsMap}
        isViewMode={isViewMode || isFreeFlow}
        handleMovePG={handleMovePG}
      />

      <div className={classes.dottedLine} />

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
