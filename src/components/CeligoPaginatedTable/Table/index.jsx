import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ActionMenu from './ActionMenu';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';

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
  actionCell: {
    padding: `0 !important`,
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
    textAlign: 'center',
  },
}));

export default function CeligoTable({
  columns,
  rowActions,
  data = [],
  selectableRows,
  isSelectableRow,
  selectedResources = {},
  isAllSelected,
  handleSelectAllChange,
  handleSelectChange,
  resourceKey = '_id',
  sort = {},
  handleSort,
  actionProps = {},
}) {
  const history = useHistory();
  const classes = useStyles();
  const { order = 'desc', orderBy = 'lastModified' } = sort;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {selectableRows && (
            <TableCell>
              <Checkbox
                icon={
                  <span>
                    <CheckboxUnselectedIcon />
                  </span>
                }
                checkedIcon={
                  <span>
                    <CheckboxSelectedIcon />
                  </span>
                }
                onChange={event => handleSelectAllChange(event)}
                checked={isAllSelected}
                color="primary"
              />
            </TableCell>
          )}
          {(typeof columns === 'function'
            ? columns('', actionProps)
            : columns
          ).map(col =>
            col.orderBy ? (
              <TableCell
                style={col.width ? { width: col.width } : undefined}
                key={col.heading}
                align={col.align || 'left'}
                sortDirection={orderBy === col.orderBy ? order : false}>
                <TableSortLabel
                  active={orderBy === col.orderBy}
                  direction={order}
                  onClick={() =>
                    handleSort(order === 'asc' ? 'desc' : 'asc', col.orderBy)
                  }>
                  {col.headerValue
                    ? col.headerValue('', actionProps)
                    : col.heading}
                  {orderBy === col.orderBy ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : (
              <TableCell
                key={col.heading}
                style={col.width ? { width: col.width } : undefined}
                align={col.align || 'left'}>
                {col.headerValue
                  ? col.headerValue('', actionProps)
                  : col.heading}
              </TableCell>
            )
          )}
          {rowActions && (
            <TableCell className={classes.actionColHead}>Actions</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(r => (
          <TableRow hover key={r[resourceKey]} className={classes.row}>
            {selectableRows && (
              <TableCell>
                {(isSelectableRow ? !!isSelectableRow(r) : true) && (
                  <Checkbox
                    onChange={event =>
                      handleSelectChange(event, r[resourceKey])
                    }
                    checked={!!selectedResources[r.errorId]}
                    color="primary"
                    icon={
                      <span>
                        <CheckboxUnselectedIcon />
                      </span>
                    }
                    checkedIcon={
                      <span>
                        <CheckboxSelectedIcon />
                      </span>
                    }
                  />
                )}
              </TableCell>
            )}
            {(typeof columns === 'function'
              ? columns(r, actionProps)
              : columns
            ).map((col, index) =>
              index === 0 ? (
                <TableCell
                  component="th"
                  scope="row"
                  key={col.heading}
                  align={col.align || 'left'}>
                  {col.value(r, actionProps, history.location)}
                </TableCell>
              ) : (
                <TableCell key={col.heading} align={col.align || 'left'}>
                  {col.value(r, actionProps, history.location)}
                </TableCell>
              )
            )}
            {rowActions && (
              <TableCell className={classes.actionCell}>
                <ActionMenu
                  // rowActions may or may not be a fn. Sometimes
                  // the actions are static, other times they are
                  // determinant on the resource they apply to.
                  actions={(typeof rowActions === 'function'
                    ? rowActions(r, actionProps)
                    : rowActions
                  ).map(({ label, component: Action }) => ({
                    label:
                      typeof label === 'function'
                        ? label(r, actionProps)
                        : label,
                    component: <Action {...actionProps} resource={r} />,
                  }))}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
