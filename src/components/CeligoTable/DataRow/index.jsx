import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import {makeStyles } from '@material-ui/core/styles';
import { TableRow } from '@material-ui/core';
import useScrollIntoView from '../../../hooks/useScrollIntoView';

const useStyles = makeStyles(theme => ({
  tableRow: {
    '&:last-child': {
      '& > .MuiTableCell-body': {
        border: 'none',
      },
    },
  },
  rowSelected: {
    '&$selected': {
      borderLeft: `6px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.lightest2,
      '&:hover': {
        backgroundColor: theme.palette.primary.lightest2,
      },
    },
  },
  selected: {},
  pointer: {
    cursor: 'pointer',
  },
}));

export default function DataRow({ children, rowData, onRowOver, onRowOut, className, additionalConfigs, onRowClick }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { IsActiveRow } = additionalConfigs || {};
  const rowRef = useRef();

  useScrollIntoView(rowRef, IsActiveRow?.({ rowData }), 'nearest');

  const handleMouseOver = useCallback(() => {
    onRowOver(rowData, dispatch);
  }, [dispatch, onRowOver, rowData]);

  const handleMouseOut = useCallback(() => {
    onRowOut(rowData, dispatch);
  }, [dispatch, onRowOut, rowData]);

  const handleClick = useCallback(event => {
    onRowClick({ rowData, dispatch, event });
  }, [dispatch, rowData, onRowClick]);

  return (
    <TableRow
      hover
      className={clsx(classes.tableRow, className, {
        [classes.pointer]: !!onRowClick && !IsActiveRow?.({ rowData }),
      })}
      classes={{
        root: classes.rowSelected,
        selected: classes.selected,
      }}
      onMouseOver={onRowOver && handleMouseOver}
      onFocus={onRowOver && handleMouseOver}
      onMouseOut={onRowOut && handleMouseOut}
      onBlur={onRowOut && handleMouseOut}
      onClick={onRowClick && handleClick}
      selected={IsActiveRow?.({ rowData })}
      ref={rowRef}
    >
      {children}
    </TableRow>
  );
}
