/* eslint-disable no-use-before-define */
// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Widget from '../../../../../components/Widget';
import '../Styles/styles.css';
import '../Styles/content.css';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { initialGraphTypes, initialLayouts} from './MetaData';

const ResponsiveGridLayout = WidthProvider(Responsive);

// eslint-disable-next-line no-unused-vars
let originalItems = [];

const useStyles = makeStyles(theme => ({
  root: {
    '& span:hover': { backgroundColor: '#F9FAFF' },
    display: 'flex',
  },
  box: {
    height: 100,
    width: 350,
    display: 'flex',
    borderRadius: 7,
  },
  boxBackground: {
    backgroundColor: 'white',
    color: 'black',
  },
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
    fontWeight: 'bold',
  },
  iconStyle: {
    width: 55,
    height: 55,
  },
  connections: {
    borderColor: '#8EC635',
    color: '#8EC635',
  },
  flows: {
    borderColor: '#9C3A99',
    color: '#9C3A99',
  },
}));

export default function Content({colsize, id, data}) {
  const [layouts, setLayouts] = useState(
    getFromLS('layouts', `lt${id}`) || initialLayouts
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { childId } = match.params;

  const [graphTypes, setGraphTypes] = useState(
    getFromLS('graphTypes', `gt${id}`) || initialGraphTypes
  );

  const isAPICallComplete = useSelector(selectors.isAPICallComplete);
  // const layoutData = useSelector(selectors.layoutData);
  // const graphData = useSelector(selectors.graphData);

  // console.log({graphData, layoutData});
  if (layouts.lg.length === 0) {
    setLayouts(initialLayouts);
  }

  originalItems = layouts.lg.map(item => parseInt(item.i, 10));

  useEffect(() => {
    if (!isAPICallComplete) {
      dispatch(actions.dashboard.request());
    }
  }, [dispatch, isAPICallComplete]);

  const [col] = useState(colsize);

  // const [items, setItems] = useState(originalItems);

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };
  const onRemoveItem = itemId => {
    // setItems(items.filter((i) => i !== itemId));
    const temp = layouts.lg.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
    const temp2 = layouts.md.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
    const temp3 = layouts.sm.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
    const temp4 = layouts.xs.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
    const temp5 = layouts.xxs.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
    const temp6 = {
      lg: temp,
      md: temp2,
      sm: temp3,
      xs: temp4,
      xxs: temp5,
    };

    setLayouts(temp6);
  };

  const handleGraphChange = (graphType, id) => {
    const temp = graphTypes.filter(i => i.id !== id);

    setGraphTypes(temp.concat({ id, type: graphType }));
  };

  const generateDOM = () => {
    if (layouts) {
      return layouts.lg.map(l => {
        const gt = graphTypes.find(item => item.id === l.i) || 'string';
        let gd = {};

        if (gt.dataType === 'connections') {
          gd = data.connections;
        } else if (gt.dataType === 'imports') {
          gd = data.imports;
        } else if (l.i === '5') {
          gd = data.connections;
        } else {
          gd = data.flows;
        }

        return (
          <div className={classes.reactGridItem} key={l.i}>
            <Widget
              id={l.i}
              onRemoveItem={onRemoveItem}
              graphType={gt.type || 'Bar'}
              onChange={handleGraphChange}
              graphData={gd}
              title={gt.dataType}
              childId={childId}
              graphPrefrence={gt}
              integrationId={gt.integrationId}
            />
          </div>
        );
      });
    }
  };

  return (
    <div className={classes.responsiveContainer}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{
          lg: parseInt(col, 10),
          md: parseInt(col, 10),
          sm: parseInt(col, 10),
          xs: parseInt(col, 10),
          xxs: parseInt(col, 10),
        }}
        rowHeight={60}
        preventCollision={false}
        autoSize
        margin={{
          lg: [20, 20],
          md: [20, 20],
          sm: [20, 20],
          xs: [20, 20],
          xxs: [20, 20],
        }}
        // width={width}
        onLayoutChange={onLayoutChange}>
        {generateDOM()}
      </ResponsiveGridLayout>
    </div>
  );
}

function getFromLS(key, id) {
  let ls = {};

  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(`rgl-8${id}`)) || {};
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return ls[key];
}
