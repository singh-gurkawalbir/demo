import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { ButtonBase } from '@material-ui/core';
import { getApplicationConnectors } from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import CeligoLogo from '../../components/CeligoLogo';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1100,
    marginTop: theme.spacing(4),
  },
  logo: {
    width: 90,
    display: 'inline-block',
  },
}));

export default function MarketPlaceGridList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const applicationConnectors = getApplicationConnectors();

  useEffect(() => {
    dispatch(actions.marketPlace.requestConnectors());
    dispatch(actions.marketPlace.requestTemplates());
  }, [dispatch]);

  return (
    <Fragment>
      <CeligoPageBar title="Marketplace" />
      <div className={classes.root}>
        <GridList
          cellHeight={180}
          className={classes.gridList}
          cols={6}
          spacing={24}>
          {applicationConnectors.map(connector => (
            <GridListTile key={connector.id}>
              <ButtonBase className={classes.logo}>
                <CeligoLogo />
              </ButtonBase>
              <GridListTileBar title={connector.name} />
            </GridListTile>
          ))}
        </GridList>
      </div>
    </Fragment>
  );
}
