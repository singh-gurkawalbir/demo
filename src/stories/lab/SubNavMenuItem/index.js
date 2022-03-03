import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, makeStyles, Typography } from '@material-ui/core';
import SortableHandle from '../../../components/Sortable/SortableHandle';
import Status from '../../../components/Buttons/Status';
import StatusCircle from '../../../components/StatusCircle';

const useStyles = makeStyles(theme => ({
  listItemwrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    '&:hover': {
      '& >*  svg': {
        color: isGripperVisible => isGripperVisible ? theme.palette.primary.main : '',
      },
    },
  },
  name: {
    paddingRight: theme.spacing(1),
  },
}));
export default function SubNavMenuItem({name, errorCount, isGripperVisible = false, onMouseEnter, onMouseLeave}) {
  const classes = useStyles(isGripperVisible);

  // const errorStatus = useMemo(() => {
  //   if (errorCount === 0) {
  //     return <StatusCircle size="mini" variant="success" />;
  //   }

  //   return (
  //     <Status size="mini" variant="error" >
  //       <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
  //     </Status>
  //   );
  // }, [errorCount]);

  return (
    <ListItem className={classes.listItemwrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isGripperVisible && (
        <SortableHandle isVisible={isGripperVisible} />
      )}
      <Typography className={classes.name}>{name}</Typography>
      {errorCount && (
      <Status variant="error" size="small">
        <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
      </Status>
      )}
      {errorCount === 0 && <StatusCircle variant="success" size="mini" />}
    </ListItem>
  );
}

SubNavMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isGripperVisible: PropTypes.bool,
  errorCount: PropTypes.number,
};
