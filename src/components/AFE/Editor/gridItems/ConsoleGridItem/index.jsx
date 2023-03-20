import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../reducers';
import PanelTitle from '../PanelTitle';
import CodePanel from '../../panels/Code';

// utilizing the error section in grid to display console panel
const useStyles = makeStyles(theme => ({
  gridItem: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
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

const overrides = { wrap: true };
export default function ConsoleGridItem({ editorId }) {
  const classes = useStyles();
  const { logs } = useSelector(state => selectors.editorResult(state, editorId));

  if (!logs && !Array.isArray(logs)) return null;

  const logsText = logs.join('\n');

  return (
    <div className={classes.gridItem}>
      <PanelTitle title="Console" />
      <div className={classes.flexContainer} data-private>
        <CodePanel
          data-private
          readOnly
          overrides={overrides}
          mode="text"
          name="error"
          value={logsText}
        />
      </div>
    </div>
  );
}
