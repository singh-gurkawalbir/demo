import { TableCell } from '@material-ui/core';
import React from 'react';

const ContentCell = ({
  meta,
  rowData,
  index,
}) => {
  const { Value, align, useGetCellStyling = () => {}} = meta;
  const val = Value({rowData});
  const className = useGetCellStyling({rowData});
  const cellValue = val === undefined ? null : val;

  if (index === 0) {
    return (
      <TableCell
        component="th"
        scope="row"
        align={align || 'left'}
        className={className}>
        {cellValue}
      </TableCell>
    );
  }

  return (
    <TableCell
      align={align || 'left'}
      className={className}>
      {cellValue}
    </TableCell>
  );
};

export default function AllContentCells({useColumns, rowData}) {
  const columns = useColumns();

  return (
    columns.map(({key, isLoggable, ...meta}, index) => (
      <ContentCell
        data-private={!isLoggable}
        key={key}
        meta={meta}
        rowData={rowData}
        index={index} />
    ))

  );
}
