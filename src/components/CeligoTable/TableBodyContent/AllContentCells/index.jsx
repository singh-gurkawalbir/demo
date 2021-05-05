
import {
  TableCell,
} from '@material-ui/core';
import React from 'react';

const ContentCell = ({
  meta,
  rowData,
  index,
}) => {
  const { Value, align} = meta;
  const val = Value({rowData});

  const cellValue = val === undefined ? null : val;

  if (index === 0) {
    return (
      <TableCell
        component="th"
        scope="row"
        align={align || 'left'}>
        {cellValue}
      </TableCell>
    );
  }

  return (
    <TableCell align={align || 'left'}>
      {cellValue}
    </TableCell>
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
