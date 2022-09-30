import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Divider, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import { DATA_TYPES_DROPDOWN_OPTIONS, DATA_TYPES_REPRESENTATION_LIST, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import actions from '../../../../../../../actions';
import { TextButton } from '../../../../../../Buttons';
import ArrowPopper from '../../../../../../ArrowPopper';
import ArrowDownFilledIcon from '../../../../../../icons/ArrowDownFilledIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';
import useSyncedRef from '../../../../../../../hooks/useSyncedRef';

const useStyles = makeStyles(theme => ({
  dataType: {
    color: theme.palette.primary.main,
    justifyContent: 'end',
    padding: 0,
    '& svg': {
      marginLeft: theme.spacing(-1),
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      height: 38,
      paddingRight: theme.spacing(1),
      '& .MuiButton-endIcon': {
        display: 'none',
      },
    },
  },
  listPopper: {
    maxWidth: theme.spacing(31),
    top: '5px !important',
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    maxWidth: theme.spacing(31),
    '& button': {
      minWidth: 0,
      display: 'none',
      paddingRight: theme.spacing(1),
    },
    '&:hover button': {
      display: 'block',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
      '&:first-child': {
        borderRadius: [0, 4, 4, 0],
      },
      '&:last-child': {
        borderRadius: [0, 4, 4, 0],
      },
    },
    '&:last-child': {
      border: 'none',
    },
  },
  itemRoot: {
    wordBreak: 'break-word',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  itemSelected: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper2,
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: theme.palette.primary.main,
      left: '0px',
    },
  },
  listWrapper: {
    minWidth: theme.spacing(20),
    maxHeight: theme.spacing(37),
    overflowY: 'auto',
  },
  itemRootName: {
    margin: 0,
    fontSize: 15,
    lineHeight: '42px',
  },
  actionsMenuPopperArrow: {
    left: '50px !important',
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 0.5),
  },
  sourceDataTypeDropDown: {
    display: 'flex',
    alignItems: 'center',
    width: theme.spacing(9),
    marginLeft: -theme.spacing(13),
    justifyContent: 'end',
    zIndex: 1,
  },
  dataTypeList: {
    width: theme.spacing(8),
    wordBreak: 'break-word',
    textAlign: 'right',
  },
  dataTypeSelected: {
    width: theme.spacing(8),
    textAlign: 'right',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const getToolTipTitle = (isHandlebarExp, isHardCodedValue) => {
  if (isHandlebarExp) {
    return 'The data type of handlebars expressions is auto-set to "string" and cannot be changed.';
  }
  if (isHardCodedValue) {
    return 'The data type of hard-coded values is auto-set to "string" and cannot be changed.';
  }

  return '';
};

export default function SourceDataType({
  dataType = 'string',
  disabled,
  nodeKey,
  className,
  anchorEl,
  setAnchorEl,
  sourceDataTypes,
  isHardCodedValue,
  isHandlebarExp,
  isFocused,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const sourceDataTypeRef = useSyncedRef(!sourceDataTypes?.length ? [MAPPING_DATA_TYPES.STRING] : sourceDataTypes);
  const open = !!anchorEl;
  const selectedDataTypeLabels = [];

  const handleMenu = useCallback(
    event => {
      if (selectedDataTypeLabels && selectedDataTypeLabels.length > 1) {
        dispatch(actions.mapping.v2.updateActiveKey(nodeKey));

        history.push(buildDrawerUrl({
          path: drawerPaths.MAPPINGS.V2_SETTINGS,
          baseUrl: history.location.pathname,
          params: { nodeKey, test: 'test' },
        }));
      } else {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      }
    },
    [anchorEl, dispatch, history, setAnchorEl, nodeKey, selectedDataTypeLabels]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  sourceDataTypeRef.current && sourceDataTypeRef.current.forEach(datatype => {
    selectedDataTypeLabels.push(DATA_TYPES_REPRESENTATION_LIST[[datatype]]);
  });

  const onDataTypeChange = useCallback(newDataType => {
    handleClose();
    sourceDataTypeRef.current = [newDataType];
    dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType, true));
  }, [handleClose, dispatch, nodeKey, sourceDataTypeRef]);

  return (
    <div className={clsx(classes.sourceDataTypeDropDown, className)}>

      <Tooltip
        title={getToolTipTitle(isHandlebarExp, isHardCodedValue)}
        placement="bottom" >
        {/* this span needs to be added to render the tooltip correctly */}
        <span>
          <TextButton
            onClick={handleMenu}
            disabled={disabled}
            endIcon={sourceDataTypes && sourceDataTypes.length > 1 ? '' : <ArrowDownFilledIcon />}
            className={classes.dataType} >
            { isFocused ? <span className={classes.dataTypeList}>{selectedDataTypeLabels.join()}</span> : (
              <span className={classes.dataTypeSelected}>
                {selectedDataTypeLabels.join()}
              </span>
            )}
          </TextButton>
        </span>
      </Tooltip>
      <Divider className={classes.divider} orientation="vertical" />

      <ArrowPopper
        id="dataTypesList"
        open={open}
        anchorEl={anchorEl}
        classes={{
          popper: classes.listPopper,
        }}
        placement="bottom-end"
        onClose={handleClose}>
        <List
          dense
          className={classes.listWrapper}>
          {DATA_TYPES_DROPDOWN_OPTIONS.map(opt => (
            <ListItem
              button
              onClick={() => {
                onDataTypeChange(opt.id);
              }}
              className={clsx(classes.itemRoot, {
                [classes.itemSelected]: opt.id === dataType,
              })}
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              key={opt.id}>
              <ListItemText className={classes.itemRootName}>{opt.label}</ListItemText>
            </ListItem>
          ))}
        </List>

      </ArrowPopper>
    </div>
  );
}

