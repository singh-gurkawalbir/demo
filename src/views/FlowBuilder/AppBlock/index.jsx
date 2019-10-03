import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IconTextButton from '../../../components/IconTextButton';
import ExportIcon from '../../../components/icons/ExportsIcon';
import LookupIcon from '../../../components/icons/LookUpIcon';
import ListenerIcon from '../../../components/icons/ListenerIcon';
import ImportIcon from '../../../components/icons/ImportsIcon';
import ApplicationImg from '../../../components/icons/ApplicationImg';

const blockMap = {
  export: { label: 'EXPORT', Icon: ExportIcon },
  import: { label: 'IMPORT', Icon: ImportIcon },
  lookup: { label: 'LOOKUP', Icon: LookupIcon },
  listener: { label: 'LISTENER', Icon: ListenerIcon },
};
const blockHeight = 100;
const blockWidth = 150;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  innerContainer: {
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
  onBlockClick,
  blockType,
  connectorType,
  assistant,
  name,
  opacity = 1,
}) {
  const classes = useStyles();
  const block = blockMap[blockType];

  return (
    <div className={classes.root}>
      {children[2] /* <LeftActions> */}

      <div className={classes.innerContainer}>
        <IconTextButton
          className={classes.resourceButton}
          variant="contained"
          color="primary"
          onClick={onBlockClick}>
          <block.Icon />
          {block.label}
        </IconTextButton>
        <div ref={forwardedRef} className={classes.box} style={{ opacity }}>
          <ApplicationImg
            size="large"
            type={connectorType}
            assistant={assistant}
          />
        </div>
        {children[1] /* <BottomActions> */}
        <Typography className={classes.name} variant="body1">
          {name}
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
