import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    display: 'grid',
    gridGap: theme.spacing(2),
    alignItems: 'stretch',
    height: '100%',
  },
}));

export default function PanelGrid({ children, height, width, className }) {
  const classes = useStyles();
  const size = { height, width };

  return (
    <div className={clsx(classes.gridContainer, className)} style={size}>
      {children}
    </div>
  );
}
