import { withStyles } from '@material-ui/core/styles';
import themeProvider from '../theme/themeProvider';
import colors from '../theme/colors';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& div': {
      // jss-nested applies this to all child div nodes
      height: 100,
      minWidth: 100,
      // border: 'solid 1px black',
      padding: theme.spacing.unit,
      margin: theme.spacing.unit,
    },
  },
});

function ColorPalette({ classes }) {
  const theme = themeProvider();
  const contrastText = theme.palette.getContrastText;

  return (
    <div className={classes.root}>
      {Object.keys(colors).map(name => (
        <div
          style={{
            color: contrastText(colors[name]),
            backgroundColor: colors[name],
          }}
          key={name}>
          {name}
          <br />
          {colors[name]}
        </div>
      ))}
    </div>
  );
}

export default withStyles(styles)(ColorPalette);
