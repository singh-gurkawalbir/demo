import { useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    position: 'sticky',
    display: 'flex',
    overflow: 'hidden',
    zIndex: 1,
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    // any smaller and table "jiggles" when transitioning to/from hover state
    width: 125,
    textAlign: 'center',
  },
  ellipsisContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function ActionMenu({ actions }) {
  const classes = useStyles();
  const actionContainerEl = useRef(null);

  if (!actions || !actions.length) return null;

  const renderAction = ({ key, component }) => (
    <Fragment key={key}>{component}</Fragment>
  );

  return (
    <div ref={actionContainerEl} className={classes.actionContainer}>
      {actions.map(a => renderAction(a))}
    </div>
  );
}
