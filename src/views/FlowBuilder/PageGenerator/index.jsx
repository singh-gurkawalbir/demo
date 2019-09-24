import { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import itemTypes from '../itemTypes';
import * as selectors from '../../../reducers';
import IconButton from '../../../components/IconButton';
import DownloadIcon from '../../../components/icons/DownloadIcon';
import ApplicationImg from '../../../components/icons/ApplicationImg';

const pgBoxHeight = 120;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  pgBox: {
    display: 'flex',
    borderRadius: 8,
    alignItems: 'center',
    width: pgBoxHeight + 30,
    height: pgBoxHeight,
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    cursor: 'move',
    backgroundColor: theme.palette.background.paper,
  },
  processorActions: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: 50,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    top: -(pgBoxHeight + theme.spacing(3 * 2)) / 2,
    height: pgBoxHeight + theme.spacing(3 * 2),
    position: 'relative',
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
  resourceButton: {
    top: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    alignSelf: 'center',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    margin: theme.spacing(2, 0, 0, 1),
  },
}));
const PageGenerator = ({ location, history, match, index, isLast, ...pg }) => {
  const classes = useStyles();
  const ref = useRef(null);
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, 'exports', pg._exportId)
  );
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;

  function handleResourceClick() {
    const to = `${match.url}/edit/exports/${pg._exportId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  drag(ref);

  return (
    <div className={classes.pgContainer}>
      <div className={classes.flex}>
        <IconButton
          className={classes.resourceButton}
          variant="outlined"
          onClick={handleResourceClick}>
          <DownloadIcon />
          EXPORT
        </IconButton>{' '}
        <div ref={ref} className={classes.pgBox} style={{ opacity }}>
          <ApplicationImg
            size="large"
            type={resource.adaptorType}
            assistant={resource.assistant}
          />
        </div>
        <Typography className={classes.name} variant="body1">
          {resource.name || resource.id}
        </Typography>
      </div>
      <div
        className={clsx(classes.line, {
          [classes.firstLine]: index === 0,
          [classes.connectingLine]: index > 0,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);
