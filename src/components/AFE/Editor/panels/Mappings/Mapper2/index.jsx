import React, {useCallback} from 'react';
import Tree from 'rc-tree';
import {isEqual} from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: theme.spacing(9),
      position: 'relative',
      height: '100%',
    },
    '& .rc-tree-indent-unit:before': {
      position: 'absolute',
      top: '-9px',
      right: '30px',
      bottom: '7px',
      borderRight: '1px solid #d9d9d9',
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      border: '1px solid transparent',
      '&:hover': {
        '& .rc-tree-draggable-icon': {
          visibility: 'visible',
        },
      },
      '&.dragging': {
        // border: `1px dashed ${theme.palette.primary.main}`,
      },
      '&.drop-target': {
        // borderTop: `1px dashed ${theme.palette.primary.main}`,
        // borderBottom: `1px dashed ${theme.palette.primary.main}`,
      },
      '&.drag-over-gap-bottom,&.drag-over-gap-top,&.drag-over': {
        '& .rc-tree-node-content-wrapper': {
          '&>div': {
            backgroundColor: `${theme.palette.primary.main}!important`,
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
      // width: 500,
    },
    '& .rc-tree-treenode-active': {
      background: theme.palette.primary.light,
    },
    '& .MuiFilledInput-multiline': {
      padding: '6px 15px',
    },
    '& .MuiInputAdornment-root': {
      top: '50%',
      transform: 'translateY(-50%)',
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
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state), isEqual);
  const expandedKeys = useSelector(state => selectors.v2MappingExpandedKeys(state), shallowEqual);

  const onDropHandler = useCallback(info => {
    dispatch(actions.mapping.v2.dropRow(info));
  }, [dispatch]);

  // this function ensures the row can be dragged via the drag handle only
  // and not from any other place
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
        defaultExpandAll={false}
        expandedKeys={expandedKeys}
        onExpand={onExpandHandler}
        switcherIcon={SwitcherIcon}
        allowDrop={allowDrop}
        onDrop={onDropHandler}
        // activeKey={treeData[0].key}
        draggable={dragConfig}
        onDragStart={onDragStart}
        disabled={disabled}
        // height={500}
      //   itemHeight={50}
      //   virtual={false}
            />
    </div>
  );
}
