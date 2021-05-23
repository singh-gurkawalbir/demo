import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import clsx from 'clsx';
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
      position: 'relative',
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
  seperator: {
    width: 'calc(100% - 275px)',
    position: 'absolute',
    // top: 86,
    marginLeft: 275,
    borderTop: `3px dotted ${theme.palette.divider}`,
    height: 285,
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
  lastSeperator: {
    borderRight: '0 !important',
  },
}));
const SortableItem = SortableElement(({ value }) => (
  <li>
    {value}
  </li>
));

const SortableList = SortableContainer(({ pageGenerators, classes, handleDelete, flowId, integrationId, flowErrorsMap, isViewMode }) => (
  <ul>
    {pageGenerators.map((pg, i) => (
      <>
        <li
          className={clsx(classes.seperator, {
            [classes.lastSeperator]: i + 1 === pageGenerators.length,
          })} style={{top: 86 + 285 * i}} />
        <SortableItem
          index={i}
          hideSortableGhost={false}
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
        />
      )
    }
    />
      </>
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

  const handleSortEnd = useHandleMovePG(flowId);
  const handleAddGenerator = useHandleAddGenerator();

  return (
    <div className={classes.generatorContainer}>
      <SortableList
        onSortEnd={handleSortEnd}
        axis="y"
        pageGenerators={pageGenerators}
        handleDelete={handleDelete}
        flowId={flowId}
        integrationId={integrationId}
        flowErrorsMap={flowErrorsMap}
        isViewMode={isViewMode || isFreeFlow}
        classes={classes}
      />

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
