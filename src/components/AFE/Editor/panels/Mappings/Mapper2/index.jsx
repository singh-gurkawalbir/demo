import React, {useCallback} from 'react';
import Tree from 'rc-tree';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {allowDrop} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  treeRoot: {
    flex: 1,
    '& .rc-tree-list': {
      minHeight: '100%',
      display: 'flex',
    },
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: theme.spacing(9),
      position: 'relative',
      height: '100%',
    },
    '& .rc-tree-indent-unit:before': {
      position: 'absolute',
      top: '-9px',
      right: '29px',
      bottom: '7px',
      borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      border: '1px solid transparent',
      '&.hideRow': {
        display: 'none',
      },
      '&:hover': {
        '& .rc-tree-draggable-icon': {
          visibility: 'visible',
        },
      },
      '&.drag-over-gap-bottom,&.drag-over-gap-top,&.drag-over': {
        '& .rc-tree-node-content-wrapper': {
          '&>div': {
            backgroundColor: `${theme.palette.primary.main}!important`,
          },
        },
      },
      '&[draggable="false"]': {
        '& .rc-tree-node-content-wrapper': {
          flex: 1,
        },
        '&:hover': {
          '& .rc-tree-draggable-icon': {
            visibility: 'hidden',
          },
        },
      },
    },
    '& .rc-tree-switcher,.rc-tree-draggable-icon': {
      alignSelf: 'center',
      margin: theme.spacing(1, 0),
    },
    '& .rc-tree-switcher-noop': {
      width: 30,
    },
    '& .rc-tree-draggable-icon': {
      '&>div': {
        paddingTop: 0,
      },
      visibility: 'hidden',
    },
    '& .rc-tree-node-content-wrapper': {
      flex: 1,
    },
    '& .rc-tree-treenode-active': {
      backgroundColor: theme.palette.background.paper2,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
    },
    '& .MuiFilledInput-multiline': {
      padding: '6px 15px',
    },
    '& .MuiInputAdornment-root': {
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '& .rc-tree-list-holder': {
      // flexWrap: 'nowrap',
      // display: 'flex',
      // minHeight: '100%',
      flex: '0 0 auto',
      '&>div': {
        // flex: '0 0 auto',
        overflow: 'visible !important',
      },
    },
    '& .rc-tree-list-scrollbar': {
      display: 'none !important',
    },
    '& .rc-tree-list-holder-inner': {
      position: 'relative !important',
    },
  },
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
    padding: theme.spacing(3, 3, 0),
    overflow: 'auto',
  },
})
);

export const SwitcherIcon = ({isLeaf, expanded}) => {
  if (isLeaf) {
    return null;
  }

  return expanded ? (
    <IconButton size="small">
      <ArrowUpIcon />
    </IconButton>
  ) : (
    <IconButton size="small">
      <ArrowDownIcon />
    </IconButton>
  );
};

const Row = props => (
  <Mapper2Row {...props} key={`row-${props.key}`} nodeKey={props.key} />
);
const dragConfig = {
  icon: <SortableDragHandle isVisible draggable />,
  nodeDraggable: node => (!node.isTabNode && !node.disabled),
};

export default function Mapper2({editorId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state));
  const expandedKeys = useSelector(state => selectors.v2MappingExpandedKeys(state));
  const activeKey = useSelector(state => selectors.v2ActiveKey(state));

  const onDropHandler = useCallback(info => {
    dispatch(actions.mapping.v2.dropRow(info));
  }, [dispatch]);

  // this function ensures the row can be dragged via the drag handle only
  // and not from any other place
  // this is a hack added as rc-tree module supports dragging from anywhere on row
  const onDragStart = useCallback(({event}) => {
    if (event.target.id !== 'dragHandle') {
      event.preventDefault();
    }
    const parent = event.target.parentNode.parentNode;

    event.dataTransfer.setDragImage(parent, 0, 0);
  }, []);

  const onExpandHandler = useCallback(expandedKeys => {
    dispatch(actions.mapping.v2.updateExpandedKeys(expandedKeys));
  }, [dispatch]);

  return (
    <div className={classes.mappingDrawerContent}>
      <Tree
        className={classes.treeRoot}
        titleRender={Row}
        treeData={treeData}
        showLine
        selectable={false}
        defaultExpandAll={false}
        expandedKeys={expandedKeys}
        onExpand={onExpandHandler}
        switcherIcon={SwitcherIcon}
        allowDrop={allowDrop}
        onDrop={onDropHandler}
        activeKey={activeKey}
        draggable={dragConfig}
        onDragStart={onDragStart}
        disabled={disabled}
        height={4000}
        itemHeight={60}
            />
    </div>
  );
}
