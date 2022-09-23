import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Divider, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import { DATA_TYPES_DROPDOWN_OPTIONS } from '../../../../../../../utils/mapping';
import actions from '../../../../../../../actions';
import { TextButton } from '../../../../../../Buttons';
import ArrowPopper from '../../../../../../ArrowPopper';
import ArrowDownFilledIcon from '../../../../../../icons/ArrowDownFilledIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';
import CeligoTruncate from '../../../../../../CeligoTruncate';

const useStyles = makeStyles(theme => ({
  dataType: {
    border: 'none',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    justifyContent: 'end',
    padding: 0,
    width: theme.spacing(9),
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
}));

export default function SourceDataType({
  dataType = 'string',
  disabled,
  nodeKey,
  className,
  anchorEl,
  setAnchorEl,
  sourceDataTypes,
  updateSourceDataType,
  isHardCodedValue,
  isHandlebarExp,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

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
    [anchorEl, setAnchorEl, selectedDataTypeLabels]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  sourceDataTypes && sourceDataTypes.forEach(datatype => {
    selectedDataTypeLabels.push(DATA_TYPES_DROPDOWN_OPTIONS.find(opt => opt.id === datatype)?.label);
  });

  const onDataTypeChange = useCallback(newDataType => {
    handleClose();
    updateSourceDataType(newDataType);
    dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType, true));
  }, [handleClose, dataType, dispatch, nodeKey]);

  const getToolTipTitile = (isHandlebarExp, isHardCodedValue) => {
    if (isHandlebarExp) {
      return 'The data type of handlebars expressions is auto-set to “string” and cannot be changed.';
    }
    if (isHardCodedValue) {
      return 'The data type of hard-coded values is auto-set to “string” and cannot be changed.';
    }

    return '';
  };

  return (
    <div className={clsx(classes.sourceDataTypeDropDown, className)}>

      <Tooltip
        title={getToolTipTitile(isHandlebarExp, isHardCodedValue)}
        placement="bottom" >
        {/* this span needs to be added to render the tooltip correctly */}
        <span>
          <TextButton
            onClick={handleMenu}
            disabled={disabled}
            endIcon={sourceDataTypes && sourceDataTypes.length > 1 ? '' : <ArrowDownFilledIcon />}
            className={classes.dataType} >
            { document.getElementById('extractPopper')
              ? <span className={classes.dataTypeList}>{selectedDataTypeLabels.join()}</span> : (
                <CeligoTruncate placement="bottom" disableHoverListener>
                  {selectedDataTypeLabels.join()}
                </CeligoTruncate>
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

