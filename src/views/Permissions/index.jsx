import { Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view';
import * as selectors from '../../reducers';
import CeligoPageBar from '../../components/CeligoPageBar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function Permissions() {
  const theme = useTheme();
  const classes = useStyles();
  const permissions = useSelector(state => selectors.userPermissions(state));

  return (
    <Fragment>
      <CeligoPageBar title="Permission Explorer" />
      <div className={classes.root}>
        <ReactJson
          theme={theme.palette.type === 'dark' ? 'google' : undefined}
          collapsed={1}
          displayDataTypes={false}
          src={permissions}
        />
      </div>
    </Fragment>
  );
}
