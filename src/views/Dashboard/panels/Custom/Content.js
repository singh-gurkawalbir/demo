/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
// import { withSize } from 'react-sizeme';
import makeStyles from '@mui/styles/makeStyles';
import Widget from '../../../../components/Widget/Widget';
import './Styles/styles.css';
import './Styles/content.css';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

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

const initialLayouts = {
  lg: [
    {
      i: '0',
      x: 0,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '1',
      x: 0,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '2',
      x: 1,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '3',
      x: 1,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '4',
      x: 2,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '5',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
    {
      i: '6',
      x: 1,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
  ],
  md: [
    {
      i: '0',
      x: 0,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '1',
      x: 0,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '2',
      x: 1,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '3',
      x: 1,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '4',
      x: 2,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '5',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
    {
      i: '6',
      x: 1,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
  ],
  sm: [
    {
      i: '0',
      x: 0,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '1',
      x: 0,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '2',
      x: 1,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '3',
      x: 1,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '4',
      x: 2,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '5',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
    {
      i: '6',
      x: 1,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
  ],
  xs: [
    {
      i: '0',
      x: 0,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '1',
      x: 0,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '2',
      x: 1,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '3',
      x: 1,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '4',
      x: 2,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '5',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
    {
      i: '6',
      x: 1,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
  ],
  xxs: [
    {
      i: '0',
      x: 0,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '1',
      x: 0,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '2',
      x: 1,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '3',
      x: 1,
      y: 2,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '4',
      x: 2,
      y: 1,
      w: 1,
      h: 4,
      minW: 1,
      minH: 4,
      moved: false,
      static: false,
    },
    {
      i: '5',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
    {
      i: '6',
      x: 1,
      y: 0,
      w: 1,
      h: 2,
      minW: 1,
      minH: 2,
      moved: false,
      static: false,
    },
  ],
};

const initialGraphTypes = [
  { id: '0', type: 'Bar', dataType: 'connections' },
  { id: '1', type: 'Bar', dataType: 'connections' },
  { id: '2', type: 'Bar', dataType: 'connections' },
  { id: '3', type: 'Bar', dataType: 'imports' },
  { id: '4', type: 'Bar', dataType: 'flows' },
];

export default function Content({colsize, id, data}) {
  const [layouts, setLayouts] = useState(
    getFromLS('layouts', `lt${id}`) || initialLayouts
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  const [graphTypes, setGraphTypes] = useState(
    getFromLS('graphTypes', `gt${id}`) || initialGraphTypes
  );

  const isAPICallComplete = useSelector(selectors.isAPICallComplete);
  // const customId = useSelector(selectors.customId);

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
  // const onColChange = () => {
  //   let temp = [];
  //   layouts.lg.map(function (l, i) {
  //     let arrobj = {};
  //     let y = Math.ceil(Math.random() * 4) + 1;
  //     let x = Math.round(Math.random() * 5) * 2;
  //     y: Math.floor(i / 6) * y, (l.x = x);
  //     l.y = y;
  //     arrobj = l;
  //     temp.push(arrobj);
  //   });
  //   setLayouts({ lg: temp });
  //   //  saveToLS("layouts", layouts, id);
  // };
  // const onLayoutSave = () => {
  //   saveToLS('layouts', layouts, 'lt' + id);
  //   saveToLS('graphTypes', graphTypes, 'gt' + id);
  // };
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

    // console.log(graphType);
    setGraphTypes(temp.concat({ id, type: graphType }));
    // console.log(graphTypes);
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
              graphType={gt.type || 'Area'}
              onChange={handleGraphChange}
              graphData={gd}
              title={gt.dataType}
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
        // preventCollision={false}
        autoSize
        margin={{
          lg: [20, 20],
          md: [20, 20],
          sm: [20, 20],
          xs: [20, 20],
          xxs: [20, 20],
        }}
        // compactType= {'horizontal'}
        // width={width}
        onLayoutChange={onLayoutChange}
      >
        {generateDOM()}
      </ResponsiveGridLayout>
    </div>
  );
}

// export default Content;

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

// const onAddItem = itemId => {
//   // console.log("onAddItem", graphType);
//   setItems([...items, itemId]);
//   const temp = {
//     w: 1, // puts it at the bottom
//     h: 4,
//     x: itemId % col,
//     y: Infinity,
//     i: itemId.toString(),
//     minW: 1,
//     minH: 4,
//     moved: false,
//     static: false,
//   };
//   const temp2 = {
//     w: 1, // puts it at the bottom
//     h: 4,
//     x: itemId % col,
//     y: Infinity,
//     i: itemId.toString(),
//     minW: 1,
//     minH: 4,
//     moved: false,
//     static: false,
//   };

//   const temp3 = {
//     w: 1, // puts it at the bottom
//     h: 4,
//     x: itemId % col,
//     y: Infinity,
//     i: itemId.toString(),
//     minW: 1,
//     minH: 4,
//     moved: false,
//     static: false,
//   };
//   const temp4 = {
//     w: 1, // puts it at the bottom
//     h: 4,
//     x: itemId % col,
//     y: Infinity,
//     i: itemId.toString(),
//     minW: 1,
//     minH: 4,
//     moved: false,
//     static: false,
//   };
//   const temp5 = {
//     w: 1, // puts it at the bottom
//     h: 4,
//     x: itemId % col,
//     y: Infinity,
//     i: itemId.toString(),
//     minW: 1,
//     minH: 4,
//     moved: false,
//     static: false,
//   };
//   const temp6 = {
//     lg: layouts.lg.concat(temp),
//     md: layouts.md.concat(temp2),
//     sm: layouts.sm.concat(temp3),
//     xs: layouts.xs.concat(temp4),
//     xxs: layouts.xxs.concat(temp5),
//   };

//   setLayouts(temp6);

//   setGraphTypes(
//     graphTypes.concat({ id: itemId.toString(), type: graphType })
//   );
// };

//   const str1 = JSON.stringify(graphTypes);
//   let str2 = JSON.stringify(layouts);
//   str2 = `${str1},
// ${str2}`;
