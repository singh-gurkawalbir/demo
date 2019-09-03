import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    display: 'grid',
    gridGap: theme.spacing(2),
    alignItems: 'stretch',
    height: '100%',
  },
}));

export default function PanelGrid(props) {
  const { children, height, width, className } = props;
  const classes = useStyles(props);
  const size = { height, width };

  return (
    <div className={classNames(classes.gridContainer, className)} style={size}>
      {children}
    </div>
  );
}
