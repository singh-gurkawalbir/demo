import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { useHandleAddGenerator, useHandleDelete, useHandleMovePG } from '../../hooks';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import AppBlock from '../../AppBlock';
import IconBlock from '../../IconBlock';
import itemTypes from '../../itemTypes';
import PageGenerator from '../../PageGenerator';
import { emptyObject } from '../../../../constants';
import SortableList from '../../../../components/Sortable/SortableList';
import SortableItem from '../../../../components/Sortable/SortableItem';
import useSortableList from '../../../../hooks/useSortableList';
import ConnectLineListItem from './ConnectLineListItem';

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
      },
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
  pageGenerator: {
    marginBottom: 50,
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

  const flowErrorsMap = useSelector(state => selectors.openErrorsMap(state, flowId));

  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));

  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));

  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

  const Component = isIconView ? IconBlock : AppBlock;

  const handleAddGenerator = useHandleAddGenerator();
  const {handleSortEnd} = useSortableList(useHandleMovePG(flowId));

  return (
    <div className={classes.generatorContainer}>
      <SortableList
        onSortEnd={handleSortEnd}
        distance={20}
        axis="y">
        {pageGenerators.map((pg, i) => (
          <>
            <ConnectLineListItem index={i} isLastItem={i + 1 === pageGenerators.length} />
            <SortableItem
              index={i}
              hideSortableGhost={false}
              key={
                pg._exportId ||
                pg._connectionId ||
                `${pg.application}${pg.webhookOnly}`
              }
              value={(
                <PageGenerator
                  className={classes.pageGenerator}
                  {...pg}
                  onDelete={handleDelete(itemTypes.PAGE_GENERATOR)}
                  flowId={flowId}
                  integrationId={integrationId}
                  openErrorCount={
                    (flowErrorsMap && flowErrorsMap[pg._exportId]) || 0
                  }
                  index={i}
                  isViewMode={isViewMode || isFreeFlow}
                  isLast={pageGenerators.length === i + 1}
                />
              )}
            />
          </>
        ))}
      </SortableList>
      {!pageGenerators.length && (
        <Component
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
