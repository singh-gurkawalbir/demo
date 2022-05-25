import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../../actions';
import { Canvas } from '../../../../views/FlowBuilder/FlowBuilderBody';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
  },
});

export default function Template({resourceData}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  console.log(resourceData);

  const flowId = resourceData.flows[0]._id;

  useEffect(() => {
    Object.keys(resourceData).forEach(resourceType => {
      const collection = resourceData[resourceType];

      console.log(resourceType, collection);
      dispatch(actions.resource.receivedCollection(resourceType, collection));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Canvas flowId={flowId} fullscreen />
    </div>
  );
}
