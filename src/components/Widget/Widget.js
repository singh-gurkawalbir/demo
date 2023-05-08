/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '../../views/Dashboard/panels/Custom/Styles/widget.css';
// import makeStyles from '@mui/styles/makeStyles';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import PieGraph from '../Graphs/PieGraph';
import AreaGraph from '../Graphs/AreaGraph';
import MuiBox from '../BoxWidget/BoxWidget';
import BarGraph from '../Graphs/BarGraph';

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     cursor: 'grab',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0.5rem',
//   },
//   spacer: {
//     flexGrow: 1,
//   },
//   body1: {
//     padding: '0.5rem',
//     flexGrow: 1,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   chartContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     [theme.breakpoints.up('md')]: {
//       flexDirection: 'row',
//     },
//   },
// }));

export const transformData = data => {
  let Unknown = 0;
  let offlineCount = 0;
  let onlineCount = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      if (data[obj].offline === true) {
        offlineCount += 1;
      } else if (data[obj].offline === false) {
        onlineCount += 1;
      } else {
        Unknown += 1;
      }
    }
  }

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['count'],
      MaximumYaxis: '',
    },
    values: [
      {
        label: 'Unkown',
        count: Unknown,
      },
      {
        label: 'Offline',
        count: offlineCount,
      },
      {
        label: 'Online',
        count: onlineCount,
      },
    ],
  };
};

const transformData1 = data => {
  const dates = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      const created = data[obj].createdAt.slice(0, 7);
      const modified = data[obj].lastModified.slice(0, 7);

      if (created in dates) {
        dates[created].create += 1;
      } else {
        dates[created] = { create: 1, modify: 0 };
      }
      if (modified in dates) {
        dates[modified].modify += 1;
      } else {
        dates[modified] = { create: 0, modify: 1 };
      }
    }
  }
  const values = [];

  Object.keys(dates).forEach(key =>
    values.push({
      label: key,
      createdAt: dates[key].create,
      modifiedAt: dates[key].modify,
    })
  );

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['createdAt', 'modifiedAt'],
      MaximumYaxis: '',
    },
    values,
  };
};

const transformData2 = data => {
  const types = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      const typeObj = data[obj].type;

      if (typeObj in types) {
        types[typeObj] += 1;
      } else {
        types[typeObj] = 1;
      }
    }
  }
  const values = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key in types) {
    if (Object.hasOwn(types, key)) {
      values.push({
        label: key,
        count: types[key],
      });
    }
  }

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['count'],
      MaximumYaxis: '',
    },
    values,
  };
};

export default function Widget({
  id,
  onRemoveItem,
  title,
  graphType,
  onChange,
  graphData,
}) {
  let finalData = graphData;
  const connectionName = 'connections';
  const flowName = 'flows';
  // const classes = useStyles();

  // console.log(graphType);
  if (id === '0') {
    finalData = transformData(graphData);
  } else if (id === '1' || id === '3' || id === '4') {
    finalData = transformData1(graphData);
  } else if (id === '2') {
    finalData = transformData2(graphData);
  } else if (id === '5') {
    return <MuiBox data={graphData} value={connectionName} />;
    // return null;
  } else if (id === '6') {
    return <MuiBox data={graphData} value={flowName} />;
    // return null;
  } else {
    finalData = graphData;
  }
  const [data, setData] = useState(finalData);

  const handleBarClick = dataDD => {
    const data1 = {
      ids: data.ids,
      values: [
        data.values.find(d => d[data.ids.XAxis] === dataDD.activeLabel),
      ],
    };

    // console.log("drilldown", data1);
    setData(data1);
  };

  const color = ['#CC33FF', '#7D3C98', '#2E86C1', '#138D75', '#28B463'];

  const options = [
    {
      label: 'Area',
      value: 'Area',
      config: data => (
        <AreaGraph
          data={data} color={color} onChange={handleBarClick}
        />
      ),
    },
    {
      label: 'Bar',
      value: 'Bar',
      config: data => (
        <BarGraph
          data={data}
          color={color}
          onChange={handleBarClick}
           />
      ),
    },
    {
      label: 'Pie',
      value: 'Pie',
      config: data => <PieGraph data={data} color={color} />,
    },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [, setSelection] = useState(null);
  const [impl, setImpl] = useState(
    options.find(opt => opt.label === graphType)
  );

  const handleSelection = opt => {
    setSelection(opt);
    setImpl(options.find(option => option.label === opt.target.value));
    onChange(opt.target.value, id);
  };

  const renderedOptions = options.map(option => (
    <MenuItem key={option.value} value={option.label}>
      {option.label}
    </MenuItem>
  ));

  // const eventNodes = document.getElementsByClassName('body1');

  // Object.keys(eventNodes).forEach(key => {
  //   curWidth = eventNodes[id]?.clientWidth;
  // });

  return (
    <Card
      variant="outlined"
      sx={{
        // minHeight: "300px",
        // minWidth: "300px",
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 1,
        padding: '10px',
      }}
    >
      <div className="root">
        <div className="header">
          <h2> Widget - {title}</h2>
          <div className="spacer" />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Graph Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={impl.label}
              onChange={handleSelection}
              label="graphType"
            >
              {renderedOptions}
            </Select>
          </FormControl>
          <IconButton aria-label="delete" onClick={() => onRemoveItem(id)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="body1" />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 70,
          }}
        >
          {impl.config(data)}
        </div>
      </div>
    </Card>
  );
}
