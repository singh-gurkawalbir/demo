import React, { useState, useCallback } from 'react';
import Tree from 'rc-tree';
import { useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {generateTreeFromV2Mappings, allowDrop, findNode} from '../../../../../../utils/mapping';
import SettingsDrawer from '../../../../../Mapping/Settings';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';

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
      top: '-8px',
      right: '30px',
      bottom: '8px',
      borderRight: '1px solid #d9d9d9',
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      '&:hover': {
        '& .rc-tree-draggable-icon': {
          visibility: 'visible',
        },
      },
    },
    '& .rc-tree-switcher-noop': {
      width: 30,
    },
    '& .rc-tree-draggable-icon': {
      visibility: 'hidden',
    },
    '& .rc-tree-node-content-wrapper': {
      // width: 500,
    },
    '& .rc-tree-treenode-active': {
      background: theme.palette.primary.light,
    },
    '& .MuiFilledInput-multiline': {
      paddingRight: theme.spacing(10),
    },
    '& .rc-tree-title': {
      '&>div>div': {
        width: 300,
      },
      '&>div>div:last-child': {
        width: 'auto',
      },
    },
    '& .MuiInputAdornment-root': {
      top: '50%',
      transform: 'translateY(-50%)',
    },
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

const Row = props =>

  (
    <Mapper2Row
      key={props.key}
      // flowId={flowId}
     // importId={importId}
               // index={emptyRowIndex}
      rowData={{...props}}
                // disabled={disabled}
                  />
  );
const drag = {
  icon: <SortableDragHandle isVisible draggable />,
  nodeDraggable: node => !node.isTabNode,
};

export default function Mapper2({editorId}) {
  const classes = useStyles();
  // const {mappings} = importDoc; // read from state
  const [treeData, setTreeData] = useState(generateTreeFromV2Mappings([]));
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const onDropHandler = useCallback(info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dragParentKey = info.dragNode.parentKey;
    const dropPos = info.node.pos.split('-');
    const dragPos = info.dragNode.pos.split('-');
    const dragNodeIndex = Number(dragPos[dragPos.length - 1]);
    const dropNodeIndex = Number(dropPos[dropPos.length - 1]);
    const dropPosition = info.dropPosition - dropNodeIndex;

    const newTreeData = cloneDeep(treeData);

    let dragObj;

    // Find dragObject and remove from current position
    findNode(newTreeData, 'key', dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    let ar;
    let i;

    // find drop position and drop sub-array
    findNode(newTreeData, 'key', dropKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });

    // child node is being dragged and dropped at top (0th index) of the children list
    if (dropPosition === 0 && dragParentKey === dropKey) {
      const hasTabbedRow = info.node.multipleSources;

      // if child is already at 0th position, nothing to do
      if (dragNodeIndex === 0 || (hasTabbedRow && dragNodeIndex === 1)) return;
      const {children = []} = ar[dropNodeIndex];

      // retain the tabbed row
      if (hasTabbedRow) {
        children.splice(1, 0, dragObj);
      } else {
        children.unshift(dragObj);
      }
    } else if (dropPosition === -1) { // drag obj inserted before drop node
      if (i === dragNodeIndex) return;

      ar.splice(i, 0, dragObj);
    } else { // drag obj inserted after drop node
      if (i + 1 === dragNodeIndex) return;

      ar.splice(i + 1, 0, dragObj);
    }

    setTreeData(newTreeData);
  }, [treeData]);

  // console.log('treeData', treeData);
  const onDragStart = ({event}) => {
    if (event.target.id !== 'dragHandle') {
      event.preventDefault();
    }
    const parent = event.target.parentNode.parentNode;

    event.dataTransfer.setDragImage(parent, 0, 0);
  };

  return treeData.length
    ? (
      <>
        <SettingsDrawer disabled={disabled} />
        <Tree
          className={classes.treeRoot}
          titleRender={Row}
          treeData={treeData}
          showLine
          switcherIcon={SwitcherIcon}
          allowDrop={allowDrop}
          onDrop={onDropHandler}
          // activeKey={treeData[0].key}
          draggable={drag}
          onDragStart={onDragStart}
          // height={500}
        //   itemHeight={50}
        //   virtual={false}
              />
      </>

    )
    : 'Loading mappings';
}
