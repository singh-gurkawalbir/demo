import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  gridContainer: {
    display: 'grid',
    gridGap: theme.spacing(2),
    alignItems: 'stretch',
    height: '100%',
  },
});

function PanelGrid(props) {
  const { children, height, width, classes, className } = props;
  const size = { height, width };

  return (
    <div className={classNames(classes.gridContainer, className)} style={size}>
      {children}
    </div>
  );
}

export default withStyles(styles)(PanelGrid);
