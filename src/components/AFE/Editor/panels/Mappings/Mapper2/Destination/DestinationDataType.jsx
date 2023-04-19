import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ArrowPopper } from '@celigo/fuse-ui';
import { DATA_TYPES_DROPDOWN_OPTIONS, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import RawHtml from '../../../../../../RawHtml';
import { message } from '../../../../../../../utils/messageStore';
import useConfirmDialog from '../../../../../../ConfirmDialog';
import actions from '../../../../../../../actions';
import { TextButton } from '../../../../../../Buttons';
import ArrowDownFilledIcon from '../../../../../../icons/ArrowDownFilledIcon';

const useStyles = makeStyles(theme => ({
  dataType: {
    border: 'none',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 0.5),
    '& svg': {
      marginLeft: theme.spacing(-1),
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      height: 38,
      backgroundColor: theme.palette.background.paper2,
    },
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
}));

export default function DestinationDataType({
  dataType,
  disabled,
  nodeKey,
  className,
  anchorEl,
  setAnchorEl,
  handleBlur,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  const open = !!anchorEl;
  const handleMenu = useCallback(
    event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl, setAnchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const selectedDataTypeLabel = DATA_TYPES_DROPDOWN_OPTIONS.find(opt => opt.id === dataType)?.label;

  const onDataTypeChange = useCallback(newDataType => {
    handleClose();

    if ((dataType === MAPPING_DATA_TYPES.OBJECT || dataType === MAPPING_DATA_TYPES.OBJECTARRAY) &&
      newDataType !== MAPPING_DATA_TYPES.OBJECT && newDataType !== MAPPING_DATA_TYPES.OBJECTARRAY) {
      confirmDialog({
        title: 'Confirm data type selection',
        message: <RawHtml html={message.MAPPER2.DATA_TYPE_WARNING} />,
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
    handleBlur();
  }, [handleClose, dataType, handleBlur, confirmDialog, dispatch, nodeKey]);

  return (
    <div className={className}>
      <Tooltip
        title={disabled || open ? '' : `Data type: ${selectedDataTypeLabel} - Click to change`}
        placement="bottom" >
        {/* this div needs to be added to render the tooltip correctly */}
        <div>
          <TextButton
            onClick={handleMenu}
            disabled={disabled}
            endIcon={<ArrowDownFilledIcon />}
            className={classes.dataType} >
            {selectedDataTypeLabel}
          </TextButton>
        </div>
      </Tooltip>

      <ArrowPopper
        id="dataTypesList"
        open={open}
        anchorEl={anchorEl}
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

