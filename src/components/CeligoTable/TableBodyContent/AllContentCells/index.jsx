import { TableCell } from '@material-ui/core';
import React from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import IsLoggableContextProvider from '../../../IsLoggableContextProvider';

export const BaseCellWrapper = ({isLoggable, children, ...rest}) => (
  <IsLoggableContextProvider isLoggable={isLoggable}>
    <TableCell
      {...isLoggableAttr(isLoggable)}
      {...rest}
      >
      {children}
    </TableCell>
  </IsLoggableContextProvider>
);
const ContentCell = ({
  meta,
  rowData,
  index,
}) => {
  const { Value, align, isLoggable, useGetCellStyling = () => {}} = meta;
  const val = Value({rowData});
  const className = useGetCellStyling({rowData});
  const cellValue = val === undefined ? null : val;

  if (index === 0) {
    return (
      <BaseCellWrapper
        isLoggable={isLoggable}
        component="th"
        scope="row"
        align={align || 'left'}
        className={className}
        >
        {cellValue}
      </BaseCellWrapper>
    );
  }

  return (
    <BaseCellWrapper
      isLoggable={isLoggable}
      align={align || 'left'}
      className={className}
    >
      {cellValue}
    </BaseCellWrapper>
  );
};

export default function AllContentCells({useColumns, rowData}) {
  const columns = useColumns();

  return (
    columns.map(({key, ...meta}, index) => (
      <ContentCell
        key={key}
        meta={meta}
        rowData={rowData}
        index={index} />
    ))

  );
}
