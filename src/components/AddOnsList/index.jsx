import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(204px, 1fr));`,
    gridRowGap: theme.spacing(3),
    padding: '24px 10px',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: `repeat(7, 1fr);`,
    },
  },
  card: {
    width: '204px',
    height: '204px',
    cursor: 'pointer',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.palette.secondary.lightest,
  },
  tile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  label: {
    textTransform: 'capitalize',
    paddingTop: theme.spacing(1),
  },
}));

export default function MarketplaceList({ integrationId }) {
  const formState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const addOnMetadata =
    formState && formState.addOns && formState.addOns.addOnMetaData;
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );
  const classes = useStyles();
  const handleUpgrade = name => {
    dispatch(
      actions.integrationApp.settings.requestUpgrade(integration, {
        addOnName: name,
        licenseId: license._id,
      })
    );
  };

  return (
    <Fragment>
      <div className={classes.root}>
        {addOnMetadata.map(data => (
          <div key={data.id}>
            <Fragment>{data.name}</Fragment>
            <Fragment>{data.description}</Fragment>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => handleUpgrade(data.name)}>
              CONTACT SALES
            </Button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
