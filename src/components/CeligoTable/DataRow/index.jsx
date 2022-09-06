import React, { useCallback, useRef, useEffect } from 'react';
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
  rowSelected: {
    '&$selected': {
      borderLeft: `6px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.lightest,
      '&:hover': {
        backgroundColor: theme.palette.primary.lightest,
      },
    },
  },
  selected: {},
  currentNavItem: {
    borderLeft: `6px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.paper2,
  },
  pointer: {
    cursor: 'pointer',
  },
}));

export default function DataRow({ children, rowData, onRowOver, onRowOut, className, additionalConfigs, onRowClick }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isActiveRow = additionalConfigs?.IsActiveRow && additionalConfigs.IsActiveRow({ rowData });
  const isCurrentNavItem = additionalConfigs?.IsThisCurrentNavItem && additionalConfigs?.IsThisCurrentNavItem({ rowData });
  const rowRef = useRef();

  useEffect(() => {
    if (rowRef?.current && isActiveRow) {
      rowRef?.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }, [rowRef, isActiveRow]);

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
        [classes.currentNavItem]: isCurrentNavItem,
        [classes.pointer]: !!onRowClick,
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
      selected={isActiveRow}
      ref={rowRef}
    >
      {children}
    </TableRow>
  );
}
