import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr));`,
    gridGap: theme.spacing(2),
    '& > div': {
      maxWidth: '100%',
      minWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `repeat(1, minmax(100%, 1fr));`,
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: `repeat(auto-fill, minmax(290px, 1fr));`,
    },
  },
  card: {
    height: '318px',
    border: '1px solid',
    position: 'relative',
    borderColor: theme.palette.secondary.lightest,
    margin: '0 auto',
    borderRadius: '4px',
  },
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
  },
  cardAction: {
    position: 'absolute',
    bottom: 10,
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
          <Card key={data.id} className={classes.card} elevation={0}>
            <div className={classes.header}>
              <Typography variant="h4">{data.name}</Typography>
            </div>
            <Typography>{data.description}</Typography>
            <CardActions className={classes.cardAction}>
              <Button
                data-test="contactSales"
                onClick={() => handleUpgrade(data.name)}
                variant="text"
                color="primary">
                Contact Sales
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Fragment>
  );
}
