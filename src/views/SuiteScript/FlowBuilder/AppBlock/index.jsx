import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import * as selectors from '../../../../reducers';
import BubbleSvg from '../../../FlowBuilder/BubbleSvg';
import ResourceButton from '../ResourceButton';

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
    // border: 'solid 1px blue',
    left: -16,
    top: 68,
  },
  rightActions: {
    position: 'absolute',
    display: 'flex',
    // border: 'solid 1px blue',
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
    // border: 'solid 1px lightBlue',
  },
  bubbleBG: {
    fill: 'white',
  },
  appLogoContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    // width: 101,
    height: 49,
  },
  appLogo: {
    position: 'relative',
    alignSelf: 'center',
    maxWidth: 101,
    maxHeight: 49,
  },
  addButton: {
    // padding: theme.spacing(2),
    // marginTop: -theme.spacing(1),
    // marginLeft: -theme.spacing(1),
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
    position: `absolute`,
    right: -theme.spacing(0.5),
    top: -theme.spacing(0.5),
    zIndex: 1,
    transition: theme.transitions.create('color'),
    color: 'rgb(0,0,0,0)',
  },
}));

export default function AppBlock({
  className,
  onDelete,
  children,
  forwardedRef,
  onBlockClick,
  blockType,
  connectorType,
  assistant,
  name,
  actions,
  resourceIndex,
  opacity = 1,
  flowId,
  resourceType,
  resource,
  integrationId,
  isViewMode,
  isMonitorLevelAccess,
  isPageGenerator,
  schedule,
  index,
  ssLinkedConnectionId,
  ...rest
}) {
  const classes = useStyles();

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
            size="large"
            type="export"
            assistant="netsuite"
          />
        </div>
        <div className={classes.buttonContainer}>
          <ResourceButton onClick={onBlockClick} variant={blockType} />
        </div>
      </div>
    </div>
  );
}
