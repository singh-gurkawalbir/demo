import React, { useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import BubbleSvg from '../../../FlowBuilder/BubbleSvg';
import ResourceButton from '../ResourceButton';
import ActionIconButton from '../../../FlowBuilder/ActionIconButton';
import MapDataIcon from '../../../../components/icons/MapDataIcon';

const blockHeight = 170;
const blockWidth = 275;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: blockWidth,
  },
  box: {
    width: blockWidth,
    height: blockHeight,
  },
  draggable: { cursor: 'move' },
  name: {
    margin: theme.spacing(1, 0, 1, 0),
    height: 50,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  middleActionContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  sideActionContainer: {
    position: 'relative',
  },
  leftActions: {
    position: 'absolute',
    display: 'flex',
    left: -16,
    top: 68,
  },
  rightActions: {
    position: 'absolute',
    display: 'flex',
    left: 280,
    top: 68,
  },
  isNotOverActions: {
    // display: 'none',
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
    '& svg': {
      width: 0,
      height: 0,
    },
  },
  actionIsNew: {
    // border: 'solid 1px',
    color: theme.palette.primary.main,
  },
  bubbleContainer: {
    position: 'relative',
    display: 'flex',
    '&:hover > button': {
      display: 'block',
      color: 'unset',
    },
  },
  bubble: {
    position: 'absolute',
    fill: theme.palette.secondary.lightest,
    background: 'transparent',
  },
  bubbleBG: {
    fill: 'white',
  },
  appLogoContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    // width: 101,
    height: 41,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: theme.spacing(4),
  },
  status: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    '& span': {
      fontSize: '12px',
    },
  },
  deleteButton: {
    position: 'absolute',
    right: theme.spacing(-0.5),
    top: theme.spacing(-0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: 'rgb(0,0,0,0)',
  },
}));

export default function AppBlock({
  className,
  onBlockClick,
  blockType,
  opacity = 1,
  resource,
}) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  let application;
  let isFileTransfer = false;
  const openMapping = useCallback(() => {
    history.push(`${location.pathname}/mapping`);
  }, [history, location.pathname]);

  if (
    resource &&
    resource[blockType] &&
    resource[blockType].netsuite &&
    resource[blockType].netsuite.type
  ) {
    application = 'netsuite';
  } else if (resource && resource[blockType]) {
    application = resource[blockType].type;
  }

  if (['ftp', 'fileCabinet', 'ACTIVITY_STREAM'].includes(application)) {
    isFileTransfer = true;
  }

  if (['fileCabinet', 'ACTIVITY_STREAM'].includes(application)) {
    application = 'netsuite';
  }

  const action = useMemo(() => {
    const {import: importRes} = resource;

    if (blockType === 'import' && importRes.mapping) {
      return (
        <>
          <ActionIconButton
            variant="middle"
            helpKey="fb.pp.imports.importMapping"
            onClick={openMapping}
            data-test="mapping">
            <MapDataIcon />
          </ActionIconButton>
        </>
      );
    }
  }, [blockType, openMapping, resource]);

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.box} style={{ opacity }}>
        <div className={classes.bubbleContainer}>
          <BubbleSvg
            height={blockHeight}
            width={blockWidth}
            classes={{ bubble: classes.bubble, bubbleBG: classes.bubbleBG }}
          />
        </div>
        <div className={classes.appLogoContainer}>
          <ApplicationImg
            className={classes.appLogo}
            type="export"
            assistant={application}
          />
        </div>
        <div className={classes.buttonContainer}>
          <ResourceButton onClick={onBlockClick} variant={blockType} isFileTransfer={isFileTransfer} />
          <div className={classes.middleActionContainer}>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
