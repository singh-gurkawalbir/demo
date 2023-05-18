export const transformData = data => {
  const resultMap = {};

  if (data && Array.isArray(data)) {
    // Check if data is defined and an array
    data.forEach(obj => {
      const date = obj._time;
      const dateObj = new Date(date);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const formattedDate = `${year}-${month}-${day}`;

      const { attribute } = obj;

      if (!resultMap[formattedDate]) {
        resultMap[formattedDate] = {
          success: 0,
          error: 0,
        };
      }

      if (attribute === 's') {
        // eslint-disable-next-line no-plusplus
        resultMap[formattedDate].success++;
      } else if (attribute === 'e') {
        // eslint-disable-next-line no-plusplus
        resultMap[formattedDate].error++;
      }
    });
  }

  const values = Object.entries(resultMap).map(([formattedDate, counts]) => ({
    label: formattedDate,
    success: counts.success,
    error: counts.error,
  }));

  values.pop();

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['success', 'error'],
      MaximumYaxis: '',
    },
    values,
  };
};

export const transformData1 = data => {
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

export const transformData2 = data => {
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
