import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
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
  const [initComplete, setInitComplete] = useState(false);

  const flowId = resourceData.flows[0]._id;

  useEffect(() => {
    Object.keys(resourceData).forEach(resourceType => {
      const collection = resourceData[resourceType];

      // console.log(resourceType, collection);
      dispatch(actions.resource.receivedCollection(resourceType, collection));
    });

    setInitComplete(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return initComplete && (
    <div className={classes.root}>
      <Canvas flowId={flowId} fullscreen />
    </div>
  );
}
