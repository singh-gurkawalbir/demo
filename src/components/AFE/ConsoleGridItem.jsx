import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PanelTitle from './PanelTitle';
import CodePanel from './GenericEditor/CodePanel';

// TODO: Azhar to do styling for console

// utilizing the error section in grid to display console panel
const useStyles = makeStyles(theme => ({
  gridItem: {
    border: `solid 1px rgb(0,0,0,0.3)`,
    overflow: 'hidden',
    minWidth: 150,
    minHeight: 100,
    gridArea: 'error',
    marginBottom: theme.spacing(2),
    backgroundColor: '#f2fbed',
  },

  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export default function ConsoleGridItem(props) {
  const { logs } = props;
  const classes = useStyles(props);

  if (!logs && !Array.isArray(logs)) return null;

  const logsText = logs.join('\n');

  return (
    <div className={classes.gridItem}>
      <div className={classes.flexContainer}>
        <PanelTitle>
          <Typography>Console</Typography>
        </PanelTitle>
        <CodePanel
          readOnly
          overrides={{ wrap: true }}
          mode="text"
          name="error"
          value={logsText}
        />
      </div>
    </div>
  );
}
