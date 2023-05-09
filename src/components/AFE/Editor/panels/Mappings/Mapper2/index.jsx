/* eslint-disable no-restricted-syntax */
import React, {useCallback, useEffect, useMemo, useRef } from 'react';
import Tree from 'rc-tree';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import InfoIcon from '../../../../../icons/InfoIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {allowDrop, filterNode, getAllKeys} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';
import actions from '../../../../../../actions';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import SearchBar from './SearchBar';
import { getMappingsEditorId } from '../../../../../../utils/editor';
import { message } from '../../../../../../utils/messageStore';
import RawHtml from '../../../../../RawHtml';
import useConfirmDialog from '../../../../../ConfirmDialog';

const useStyles = makeStyles(theme => ({
  treeRoot: {
    flex: 1,
    '& .rc-tree-list': {
      minHeight: '100%',
      display: 'flex',
    },
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: theme.spacing(5),
      position: 'relative',
      height: '100%',
    },
    '& .rc-tree-indent-unit:before': {
      position: 'absolute',
      top: '-9px',
      right: theme.spacing(1),
      bottom: '7px',
      borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      border: '1px solid transparent',
      '&.hideRow': {
        // This css for virtualisation remove space ref: IO-28685
        visibility: 'hidden',
        height: 0,
        marginTop: '-2px',
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
    '& .filter-node': {
      '& .rc-tree-title>div>div:first-child>.MuiFormControl-root': {
        borderColor: theme.palette.primary.lightest,
      },
    },
    '& .rc-tree-switcher,.rc-tree-draggable-icon': {
      alignSelf: 'center',
      margin: theme.spacing(1, 0),
    },
    '& .rc-tree-switcher': {
      '&>.MuiIconButton-root': {
        padding: 0,
      },
    },
    '& .rc-tree-switcher-noop': {
      width: theme.spacing(3),
    },
    '& .rc-tree-draggable-icon': {
      '&>div': {
        paddingTop: 0,
        minWidth: theme.spacing(2.5),
        width: theme.spacing(2.5),
      },
      visibility: 'hidden',
    },
    '& .rc-tree-node-content-wrapper': {
      flex: 1,
    },
    '& .rc-tree-treenode-active': {
      backgroundColor: theme.palette.primary.lightest,
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
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      '&>div': {
        flex: '0 0 auto',
      },
    },
  },
  virtualTree: {
    '& .rc-tree-list-holder': {
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      maxWidth: '1050px',
      width: '1050px',
      '&>div': {
        flex: '0 0 auto',
        width: '100%',
        overflow: 'visible!important',
        whiteSpace: 'nowrap',
      },
    },
  },
  virtualTreeCompactRow: {
    '& .rc-tree-list-holder': {
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      maxWidth: '1400px',
      width: '1400px',
      '&>div': {
        flex: '0 0 auto',
        width: '100%',
        overflow: 'visible!important',
        whiteSpace: 'nowrap',
      },
    },
  },
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
    paddingTop: theme.spacing(3),
    overflow: 'auto',
  },
  addSearchBar: {
    paddingTop: theme.spacing(6),
  },
  emptyMessage: {
    padding: theme.spacing(3),
  },
  emptySearchMessage: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(8),
  },
  infoFilter: {
    fontStyle: 'italic',
    display: 'flex',
    margin: theme.spacing(2, 2, 1),
    alignItems: 'center',
    color: theme.palette.secondary.main,
    '&+$mappingDrawerContent': {
      paddingTop: 0,
      height: `calc(100% - ${theme.spacing(6)}px)`,
      '& .rc-tree-list': {
        height: '100%',
      },
      '& $virtualTree': {
        '& .rc-tree-list': {
          overflow: 'hidden',
          '& .rc-tree-treenode:last-child': {
            paddingBottom: theme.spacing(6),
          },
        },
      },
    },
    '& > svg': {
      marginRight: theme.spacing(0.5),
      fontSize: theme.spacing(2),
      color: theme.palette.text.hint,
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

const Row = props => (
  <Mapper2Row {...props} key={`row-${props.key}`} nodeKey={props.key} />
);

const dragConfig = {
  icon: <SortableDragHandle isVisible draggable />,
  nodeDraggable: node => (!node.isTabNode && !node.disabled),
};

export default function Mapper2({editorId}) {
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const treeData = useSelector(state => selectors.filteredV2TreeData(state).filteredTreeData);
  const mapper2Filter = useSelector(selectors.mapper2Filter);
  const isAutoCreateSuccess = useSelector(state => selectors.mapping(state).autoCreated);
  const expandedKeys = useSelector(state => selectors.v2MappingExpandedKeys(state));
  const activeKey = useSelector(state => selectors.v2ActiveKey(state));
  const searchKey = useSelector(state => selectors.searchKey(state));
  const importId = useSelector(state => selectors.mapping(state).importId);
  const editorLayout = useSelector(state => selectors.editorLayout(state, getMappingsEditorId(importId)));// editor layout is required for adjusting horizontal scroll in both layouts
  const showNotification = useSelector(state => selectors.mapping(state)?.showNotificationFlag);
  const requiredMappingsJsonPaths = useSelector(state => selectors.mapping(state)?.requiredMappingsJsonPaths);
  const replaceRowinfo = useSelector(state => selectors.mapping(state)?.replaceRow);
  const settingDrawerActive = useRef();
  const currentScrollPosition = useRef();

  // using memo here since getAllKeys will be expensive if the number of nodes increases
  const allNodes = useMemo(() => getAllKeys(treeData).length, [treeData]);

  // rc-tree does not support horizontal scroll hence
  // handling horizontal scroll if number of child nodes are more
  const handleWheelEvent = useCallback(event => {
    if (event.deltaX) {
      event.preventDefault();
      const delta = Math.sign(event.deltaX);
      const scrollWidth = `${delta}2`;

      if (document.querySelector('.rc-tree-list-holder')) {
        document.querySelector('.rc-tree-list-holder').scrollLeft += scrollWidth;
      }
    }
  }, []);
  // when virtualization is enabled we are stopping the event propagation created due rc-virtual-list
  const handleMouseMove = useCallback(event => {
    event.stopImmediatePropagation();
  }, []);

  useEffect(() => {
    if (isAutoCreateSuccess) {
      enqueueSnackbar({
        message: 'Destination fields successfully auto-populated.',
        variant: 'success',
      });
      dispatch(actions.mapping.v2.toggleAutoCreateFlag());
    }

    return () => {
      document.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('mousemove', handleMouseMove, true);
    };
  }, [dispatch, enqueueSnackbar, handleMouseMove, handleWheelEvent, isAutoCreateSuccess]);

  // Add virtualization dynamically based on nodes added by user
  useEffect(() => {
    if (allNodes <= 50) {
      document.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('mousemove', handleMouseMove, true);
    }
  }, [allNodes, handleMouseMove, handleWheelEvent]);

  // based on activekey we are tracking the cursor position when drawer is opened
  useEffect(() => {
    if (activeKey) {
      localStorage.setItem('scrollPosition', currentScrollPosition.current);
      settingDrawerActive.current = { wasActive: activeKey };
    }
  }, [activeKey]);

  useEffect(() => {
    if (showNotification) {
      enqueueSnackbar({
        message: <RawHtml html={message.MAPPER2.OBJECT_ARRAY_NOTIFICATION} />,
        variant: 'info',
      });
      dispatch(actions.mapping.v2.toggleShowNotificationFlag());
    }
  }, [dispatch, enqueueSnackbar, showNotification]);

  useEffect(() => {
    if (replaceRowinfo?.showAddDestinationDialog) {
      confirmDialog({
        title: 'Confirm field selection',
        message: <RawHtml html={message.MAPPER2.REPLACE_ROW_NOTIFICATION} />,
        buttons: [
          {
            label: 'Confirm',
            onClick: () => {
              dispatch(actions.mapping.v2.replaceRow(true));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
            onClick: () => {
              dispatch(actions.mapping.v2.replaceRow(false));
            },
          },
        ],
        onDialogClose: () => {
          dispatch(actions.mapping.v2.replaceRow(false));
        },
      });
    }
  }, [confirmDialog, dispatch, replaceRowinfo]);

  const onDropHandler = useCallback(info => {
    dispatch(actions.mapping.v2.dropRow(info));
  }, [dispatch]);

  const filterTreeNode = useCallback(node => filterNode(node, searchKey), [searchKey]);

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

  // Add scroll handling for navigating back to the user scroll previous scroll position
  // when virtualization is enabled for rc-tree
  const onScrollHandler = useCallback(e => {
    // Add mouse move event listener to stop the default behavior
    // of mouse move by rc-tree library
    window.addEventListener('mousemove', handleMouseMove, true);

    // Add wheel event listener to handle horizontal scroll
    document.addEventListener('wheel', handleWheelEvent, {passive: false});

    if (settingDrawerActive.current && settingDrawerActive.current.wasActive) {
      const currentEle = e.currentTarget;
      // NOTE: rc-tree by default is resetting the scroll to top position when virtualization is enabled
      // in order to set the user position back on close of drawer we are adding this time out for now
      // to handle this scenario.
      // TODO: There is be a slight delay in scroll animation when the scroll
      // is returning back to current position.this needs to be fixed

      setTimeout(() => {
        const scrollPos = localStorage.getItem('scrollPosition');

        currentEle.scrollTo(0, parseInt(scrollPos, 10));
        localStorage.removeItem('scrollPosition');
      }, 10);
      settingDrawerActive.current.wasActive = false;
    }
    currentScrollPosition.current = e.currentTarget.scrollTop;
  }, [handleMouseMove, handleWheelEvent]);

  const isFilterApplied = !isEmpty(mapper2Filter) && !mapper2Filter.includes('all');
  let filterInfo = message.MAPPER2.FILTER_BY_MAPPED_FIELDS;

  if (mapper2Filter.includes('required') && mapper2Filter.includes('mapped')) {
    filterInfo = message.MAPPER2.FILTER_BY_REQUIRED_AND_MAPPED_FIELDS;
  } else if (mapper2Filter.includes('required')) {
    filterInfo = message.MAPPER2.FILTER_BY_REQUIRED_FIELDS;
  }

  return (
    <>
      {searchKey !== undefined && <SearchBar />}
      {searchKey && isEmpty(treeData) && (
      <Typography variant="body2" className={classes.emptySearchMessage}>
        Your search term doesn&apos;t match any destination fields.
      </Typography>
      )}

      {isFilterApplied && isEmpty(treeData) && (
        <Typography variant="body2" className={classes.emptyMessage}>
          You don&apos;t have any fields that match the filter you applied. <br /> Clear the filter by setting it to &quot;All fields&quot;.
        </Typography>
      )}

      {isFilterApplied && !isEmpty(treeData) && (
        <Typography component="div" variant="caption" className={classes.infoFilter}>
          <InfoIcon />
          {filterInfo}
        </Typography>
      )}

      {!isEmpty(requiredMappingsJsonPaths) && (
        <Typography component="div" variant="caption" className={classes.infoFilter}>
          <InfoIcon />
          This import has required fields that you must configure with the destination drop-down list.
        </Typography>
      )}

      <div className={clsx(classes.mappingDrawerContent, {[classes.addSearchBar]: searchKey !== undefined})}>
        <Tree
          className={clsx(classes.treeRoot, {[classes.virtualTree]: allNodes > 50}, {[classes.virtualTreeCompactRow]: allNodes > 50 && editorLayout === 'compactRow'})}
          height={allNodes > 50 ? Math.round(window.innerHeight) - 262 : undefined}
          itemHeight={allNodes > 50 ? 20 : undefined}
          titleRender={Row}
          treeData={treeData}
          showLine
          selectable={false}
          expandedKeys={expandedKeys}
          onExpand={onExpandHandler}
          switcherIcon={SwitcherIcon}
          allowDrop={allowDrop}
          onDrop={onDropHandler}
          activeKey={activeKey}
          draggable={dragConfig}
          onDragStart={onDragStart}
          disabled={isFilterApplied || disabled}
          filterTreeNode={filterTreeNode}
          onScroll={onScrollHandler}
              />
      </div>
    </>
  );
}
