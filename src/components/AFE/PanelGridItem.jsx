import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: `solid 1px ${theme.editor.panelBorder}`,
    overflow: 'hidden',
    minWidth: '150px',
    minHeight: '70px',
  },
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: '50px' },
}));

export default function PanelGridItem(props) {
  const { className, children, gridArea } = props;
  const classes = useStyles(props);

  if (!children.length) {
    return (
      <div className={classes.gridItem} style={{ gridArea }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={classNames(className, classes.gridItem)}
      style={{ gridArea }}>
      <div className={classes.flexContainer}>
        <div className={classes.title}>{children[0]}</div>
        <div className={classes.panel}>{children[1]}</div>
      </div>
    </div>
  );
}
