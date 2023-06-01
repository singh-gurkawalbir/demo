/* eslint-disable no-use-before-define */
import React, { useState, useEffect, lazy, Suspense} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import makeStyles from '@mui/styles/makeStyles';
import '../Styles/styles.css';
import '../Styles/content.css';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { initialGraphTypes, initialLayouts} from './MetaData';

const Widget = lazy(() => import('../../../../../components/Widget'));

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
  // const layoutData = useSelector(selectors.layoutData);
  const [layouts, setLayouts] = useState(initialLayouts);
  const [graphTypes] = useState(
    getFromLS('graphTypes', `graphConfig${id}`) || initialGraphTypes
  );

  if (layouts.lg.length === 0) {
    setLayouts(initialLayouts);
  }
  const classes = useStyles();
  const dispatch = useDispatch();

  const isAPICallComplete = useSelector(selectors.isAPICallComplete);

  if (layouts.lg.lengraphConfigh === 0) {
    setLayouts(initialLayouts);
  }

  originalItems = layouts.lg.map(item => parseInt(item.i, 10));

  useEffect(() => {
    if (!isAPICallComplete) {
      dispatch(actions.dashboard.request());
    }
  }, [dispatch, isAPICallComplete, layouts]);

  useEffect(() => {
  }, [dispatch, graphTypes, layouts]);

  const [col] = useState(colsize);
  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
    // dispatch(actions.dashboard.postPreference({layouts: allLayouts, graphTypes}));
  };

  const generateDOM = () => {
    if (layouts) {
      return layouts.lg.map(l => {
        const graphConfig = graphTypes.find(item => item.id === l.i) || 'string';
        let graphData = {};

        if (graphConfig.dataType === 'connections') {
          graphData = data.connections;
        } else if (graphConfig.dataType === 'imports') {
          graphData = data.imports;
        } else if (l.i === '5') {
          graphData = data.connections;
        } else {
          graphData = data.flows;
        }

        return (
          <div className={classes.reactGridItem} key={l.i}>
            <Suspense fallback={<div>Loading...</div>} />
            <Widget
              data-testid={l.i}
              id={l.i}
              graphType={graphConfig.type || 'Bar'}
              graphData={graphData}
              title={graphConfig.dataType}
              graphPrefrence={graphConfig}
              integrationId={graphConfig.integrationId}
            />
            <Suspense />
          </div>
        );
      });
    }
  };

  return (
    initialGraphTypes === undefined ? <div>Loading...</div>
      : (
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
      )
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

// const onRemoveItem = itemId => {
//   // setItems(items.filter((i) => i !== itemId));
//   const temp = layouts.lg.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
//   const temp2 = layouts.md.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
//   const temp3 = layouts.sm.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
//   const temp4 = layouts.xs.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
//   const temp5 = layouts.xxs.filter(i => parseInt(i.i, 10) !== parseInt(itemId, 10));
//   const temp6 = {
//     lg: temp,
//     md: temp2,
//     sm: temp3,
//     xs: temp4,
//     xxs: temp5,
//   };

//   setLayouts(temp6);
// };

// const handleGraphChange = (graphType, id) => {
//   const temp = graphTypes.filter(i => i.id !== id);

//   setGraphTypes(temp.concat({ id, type: graphType }));
// };
