import {
  TableBody,
  TableCell,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import ActionMenu from '../ActionMenu';
import DataRow from '../DataRow';

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  row: {
    '& > td:last-child': {
      minWidth: '125px',
    },
    '&:hover > td:last-child > svg': {
      display: 'none',
    },
  },
  actionCell: {
    padding: '5px !important',
    textAlign: 'center',
  },
  actionContainer: {
    position: 'sticky',
    display: 'flex',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    width: 125,
  },
}));
export default function TableBodyContent(
  {
    data,
    onRowOver,
    onRowOut, selectableRows,
    isSelectableRow,
    selectedResources,
    handleSelectChange,
    columns,
    useRowActions,
    variant,
  }
) {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState();

  return (
    <>
      {selectedComponent}
      <TableBody>
        {data.map(rowData => (
          <DataRow
            key={rowData.key || rowData._id}
            rowData={rowData}
            onRowOver={onRowOver}
            onRowOut={onRowOut}
            className={classes.row}
        >
            {selectableRows && (
            <TableCell>
              {(isSelectableRow ? !!isSelectableRow(rowData) : true) && (
              <Checkbox
                onChange={event => handleSelectChange(event, rowData._id)}
                checked={!!selectedResources[rowData._id]}
                color="primary"
                icon={(<span><CheckboxUnselectedIcon /></span>)}
                checkedIcon={(<span><CheckboxSelectedIcon /></span>)}
                />
              )}
            </TableCell>
            )}
            {columns.map((meta, index) => {
              const {key, Value, align, heading} = meta;
              const cellValue = <Value rowData={rowData} />;

              return (index === 0 ? (
                <TableCell
                  component="th"
                  scope="row"
                  key={key}
                  align={align || 'left'}>
                  {cellValue}
                </TableCell>
              ) : (
                <TableCell key={heading} align={align || 'left'}>
                  {cellValue}
                </TableCell>
              ));
            }

            )}
            {useRowActions && (
            <TableCell className={classes.actionCell}>
              <ActionMenu
                setSelectedComponent={setSelectedComponent}
                useRowActions={useRowActions}
                rowData={rowData}
                variant={variant}
              />
            </TableCell>
            )}
          </DataRow>
        ))}
      </TableBody>
    </>
  );
}
