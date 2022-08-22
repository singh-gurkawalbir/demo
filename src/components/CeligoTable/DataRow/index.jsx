import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import {makeStyles } from '@material-ui/core/styles';
import { TableRow } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableRow: {
    '&:last-child': {
      '& > .MuiTableCell-body': {
        border: 'none',
      },
    },
  },
  rowClicked: {
    borderLeft: `6px solid ${theme.palette.primary.main}`,
    backgroundColor: '#b3e9ff',
  },
}));

export default function DataRow({ children, rowData, onRowOver, onRowOut, className, additionalConfigs, onRowClick }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isActiveRow = additionalConfigs?.IsActiveRow && additionalConfigs.IsActiveRow({ rowData });

  const handleMouseOver = useCallback(() => {
    onRowOver(rowData, dispatch);
  }, [dispatch, onRowOver, rowData]);

  const handleMouseOut = useCallback(() => {
    onRowOut(rowData, dispatch);
  }, [dispatch, onRowOut, rowData]);

  const handleClick = useCallback(() => {
    onRowClick({ rowData, dispatch });
  }, [dispatch, rowData, onRowClick]);

  return (
    <TableRow
      hover
      className={clsx(classes.tableRow, className, {
        [classes.rowClicked]: isActiveRow,
      })}
      onMouseOver={onRowOver && handleMouseOver}
      onFocus={onRowOver && handleMouseOver}
      onMouseOut={onRowOut && handleMouseOut}
      onClick={onRowClick && handleClick}
      onBlur={onRowOut && handleMouseOut}>
      {children}
    </TableRow>
  );
}
