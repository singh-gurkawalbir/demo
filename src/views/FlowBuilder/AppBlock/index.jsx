import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import IconTextButton from '../../../components/IconTextButton';
import DownloadIcon from '../../../components/icons/DownloadIcon';
import CalendarIcon from '../../../components/icons/CalendarIcon';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import * as selectors from '../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

const boxHeight = 100;
const boxWidth = 150;
const useStyles = makeStyles(theme => ({
  box: {
    display: 'flex',
    borderRadius: 16,
    alignItems: 'center',
    width: boxWidth,
    height: boxHeight,
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
  resourceButton: {
    top: theme.spacing(2),
    // backgroundColor: theme.palette.background.paper,
    alignSelf: 'center',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  bottomActionContainer: {
    display: 'flex',
    alignSelf: 'center',
    marginTop: theme.spacing(-3),
  },
}));

function AppBlock({
  forwardedRef,
  history,
  match,
  resourceType,
  resourceId,
  opacity = 1,
}) {
  const classes = useStyles();
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );

  function handleResourceClick() {
    const to = `${match.url}/edit/${resourceType}/${resourceId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  return (
    <div className={classes.flex}>
      <IconTextButton
        className={classes.resourceButton}
        variant="contained"
        color="primary"
        onClick={handleResourceClick}>
        <DownloadIcon />
        {MODEL_PLURAL_TO_LABEL[resourceType].toUpperCase()}
      </IconTextButton>
      <div ref={forwardedRef} className={classes.box} style={{ opacity }}>
        <ApplicationImg
          size="large"
          type={resource.adaptorType}
          assistant={resource.assistant}
        />
      </div>
      <div className={classes.bottomActionContainer}>
        <IconButton>
          <CalendarIcon />
        </IconButton>
      </div>
      <Typography className={classes.name} variant="body1">
        {resource.name || resource.id}
      </Typography>
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => (
  <AppBlock {...props} forwardedRef={ref} />
));
