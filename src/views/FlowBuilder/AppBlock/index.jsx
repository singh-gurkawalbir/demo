import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IconTextButton from '../../../components/IconTextButton';
import ExportIcon from '../../../components/icons/ExportsIcon';
import ImportIcon from '../../../components/icons/ImportsIcon';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import * as selectors from '../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

const iconMap = {
  exports: ExportIcon,
  imports: ImportIcon,
};
const blockHeight = 100;
const blockWidth = 150;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  box: {
    display: 'flex',
    borderRadius: 16,
    alignItems: 'center',
    width: blockWidth,
    height: blockHeight,
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
  children,
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
    <div style={{ display: 'flex' }}>
      <div className={classes.root}>
        <IconTextButton
          className={classes.resourceButton}
          variant="contained"
          color="primary"
          onClick={handleResourceClick}>
          {iconMap[resourceType]()}
          {MODEL_PLURAL_TO_LABEL[resourceType].toUpperCase()}
        </IconTextButton>
        <div ref={forwardedRef} className={classes.box} style={{ opacity }}>
          <ApplicationImg
            size="large"
            type={resource.adaptorType}
            assistant={resource.assistant}
          />
        </div>
        {children[1] /* <BottomActions> */}
        <Typography className={classes.name} variant="body1">
          {resource.name || resource.id}
        </Typography>
      </div>
      {children[0] /* <RightActions> */}
    </div>
  );
}

// TODO: whats the best pattern to address below violation?
// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => (
  <AppBlock {...props} forwardedRef={ref} />
));
