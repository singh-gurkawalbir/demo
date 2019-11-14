import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddOnsList from './AddonList';

const useStyles = makeStyles(theme => ({
  wrapperBox: {
    padding: theme.spacing(4, 2),
    margin: theme.spacing(0, 2),
    textAlign: 'left',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
  },
}));

function AddOns(props) {
  const { integrationId } = props.match.params;
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.wrapperBox}>
        <Typography variant="h3">
          Add-ons - Customize and Extend Your Integration Apps
        </Typography>
      </div>
      <AddOnsList integrationId={integrationId} />
    </Fragment>
  );
}

export default AddOns;
