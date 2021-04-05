import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import {makeStyles } from '@material-ui/core/styles';
import { TableRow } from '@material-ui/core';

const useStyles = makeStyles({
  tableRow: {
    '&:last-child': {
      '& > .MuiTableCell-body': {
        border: 'none',
      },
    },
  },
});
export default function DataRow({ children, rowData, onRowOver, onRowOut, className }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleMouseOver = useCallback(() => {
    onRowOver(rowData, dispatch);
  }, [dispatch, onRowOver, rowData]);

  const handleMouseOut = useCallback(() => {
    onRowOut(rowData, dispatch);
  }, [dispatch, onRowOut, rowData]);

  return (
    <TableRow
      hover
      className={clsx(classes.tableRow, className)}
      onMouseOver={onRowOver && handleMouseOver}
      onFocus={onRowOver && handleMouseOver}
      onMouseOut={onRowOut && handleMouseOut}
      onBlur={onRowOut && handleMouseOut}>
      {children}
    </TableRow>
  );
}
