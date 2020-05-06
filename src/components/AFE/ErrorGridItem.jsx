import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PanelTitle from './PanelTitle';
import CodePanel from './GenericEditor/CodePanel';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: `solid 1px rgb(0,0,0,0.3)`,
    overflow: 'hidden',
    minWidth: 150,
    minHeight: 100,
    gridArea: 'error',
    marginBottom: theme.spacing(2),
  },

  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50 },
}));

export default function ErrorGridItem({ error, violations }) {
  const classes = useStyles();

  if (!error && !violations) return null;

  const errorText = [
    JSON.stringify(error),
    violations && violations.ruleError,
    violations && violations.dataError,
  ]
    .filter(e => !!e)
    .join('\n');

  return (
    <div className={classes.gridItem}>
      <div className={classes.flexContainer}>
        <PanelTitle>
          <Typography color="error">Error</Typography>
        </PanelTitle>
        <CodePanel
          readOnly
          overrides={{ wrap: true }}
          mode="text"
          name="error"
          value={errorText}
        />
      </div>
    </div>
  );
}
