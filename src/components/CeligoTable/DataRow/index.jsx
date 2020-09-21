import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TableRow } from '@material-ui/core';

export default function DataRow({ children, rowData, onRowOver, onRowOut, className }) {
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
      className={className}
      onMouseOver={onRowOver && handleMouseOver}
      onFocus={onRowOver && handleMouseOver}
      onMouseOut={onRowOut && handleMouseOut}
      onBlur={onRowOut && handleMouseOut}>
      {children}
    </TableRow>
  );
}
