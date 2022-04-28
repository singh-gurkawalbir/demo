import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { DATA_TYPES_DROPDOWN_OPTIONS, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import RawHtml from '../../../../../../RawHtml';
import messageStore from '../../../../../../../utils/messageStore';
import useConfirmDialog from '../../../../../../ConfirmDialog';
import actions from '../../../../../../../actions';
import { TextButton } from '../../../../../../Buttons';
import ArrowPopper from '../../../../../../ArrowPopper';

const useStyles = makeStyles(theme => ({
  dataType: {
    border: 'none',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    width: theme.spacing(12),
    padding: 0,
    '&.Mui-disabled': {
      height: 38,
    },
  },
  listPopper: {
    maxWidth: 250,
    left: '116px !important',
    top: '5px !important',
  },
  listPopperArrow: {
    left: '65px !important',
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    maxWidth: 248,
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
    paddingRight: '20%',
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      background: 'none',
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  itemSelected: {
    position: 'relative',
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
    minWidth: 230,
    maxHeight: 352,
    overflowY: 'auto',
  },
  itemRootName: {
    margin: 0,
    fontSize: 15,
    lineHeight: '42px',
  },
}));

export default function DestinationDataType({dataType, disabled, nodeKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = !!anchorEl;
  const handleMenu = useCallback(
    event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const selectedDataTypeLabel = DATA_TYPES_DROPDOWN_OPTIONS.find(opt => opt.id === dataType)?.label;

  const onDataTypeChange = useCallback(newDataType => {
    handleClose();

    if ((dataType === MAPPING_DATA_TYPES.OBJECT || dataType === MAPPING_DATA_TYPES.OBJECTARRAY) &&
      newDataType !== MAPPING_DATA_TYPES.OBJECT && newDataType !== MAPPING_DATA_TYPES.OBJECTARRAY) {
      confirmDialog({
        title: 'Confirm data type selection',
        message: <RawHtml html={messageStore('MAPPER2_DATA_TYPE_WARNING')} />,
        buttons: [
          {
            label: 'Confirm',
            onClick: () => {
              dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType));
    }
  }, [confirmDialog, dataType, dispatch, nodeKey, handleClose]);

  return (
    <>
      <Tooltip
        title={open ? '' : `Data type: ${selectedDataTypeLabel} - Click to change`}
        placement="bottom" >
        {/* this div needs to be added to render the tooltip correctly */}
        <div>
          <TextButton
            onClick={handleMenu}
            disabled={disabled}
            className={classes.dataType} >
            {selectedDataTypeLabel}
          </TextButton>
        </div>
      </Tooltip>

      <ArrowPopper
        id="dataTypesList"
        open={open}
        anchorEl={anchorEl}
        classes={{
          popper: classes.listPopper,
          arrow: classes.listPopperArrow,
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
    </>
  );
}

