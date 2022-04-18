import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DATA_TYPES_DROPDOWN_OPTIONS, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import RawHtml from '../../../../../../RawHtml';
import messageStore from '../../../../../../../utils/messageStore';
import useConfirmDialog from '../../../../../../ConfirmDialog';
import actions from '../../../../../../../actions';

const useStyles = makeStyles(theme => ({
  dataType: {
    border: 'none',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    width: theme.spacing(12),
    padding: 0,
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
    '& .MuiSelect-selectMenu': {
      padding: 0,
      margin: 0,
    },
  },
}));

export default function DestinationDataType({dataType, disabled, nodeKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [open, setOpen] = useState(false);

  const openSelect = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSelect = useCallback(
    () => {
      setOpen(false);
    }, []
  );

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;

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
  }, [confirmDialog, dataType, dispatch, nodeKey]);

  /* todo ashu tooltip does not work for celigo select */

  return (
    <Tooltip
      disableFocusListener
      title={open ? '' : `Data type: ${dataType} - Click to change`}
      placement="bottom" >
      <Select
        disabled={disabled}
        open={open}
        onOpen={openSelect}
        onClose={closeSelect}
        className={classes.dataType}
        onChange={onDataTypeChange}
        displayEmpty
        value={dataType} >
        {DATA_TYPES_DROPDOWN_OPTIONS.map(opt => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Tooltip>
  );
}

