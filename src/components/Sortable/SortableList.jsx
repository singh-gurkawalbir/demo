import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { SortableContainer } from 'react-sortable-hoc';

const useStyles = makeStyles({
  listContainer: {
    marginInlineStart: 0,
    marginBlockStart: 0,
    paddingInlineStart: 0,
    marginBlockEnd: 0,
    listStyleType: 'none',
    '& > li': {
      listStyle: 'none',
    },
  },
  helperClass: {
    listStyleType: 'none',
    zIndex: '999999',
  },
});

const SortableList = SortableContainer(({className, children}) => (<ul className={className}>{children}</ul>));
export default function SortableListWrapper({children, className = '', ...others}) {
  const classes = useStyles();

  return (
    <SortableList
      className={clsx(classes.listContainer, className)}
      helperClass={classes.helperClass}
      {...others}
    >
      {children}
    </SortableList>
  );
}

