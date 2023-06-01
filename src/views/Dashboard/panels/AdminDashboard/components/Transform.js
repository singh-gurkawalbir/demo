/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
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

export const transformData2 = data => {
  const values = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key in data) {
    if (Object.hasOwn(data, key)) {
      values.push({
        label: key,
        count: data[key],
      });
    }
  }
  // console.log('FINAL', data);

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

export const combinedTransform = (data, integrationId) => {
  if (integrationId === 'userGraph') {
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
          resultMap[formattedDate].success++;
        } else if (attribute === 'e') {
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
  } if (integrationId === 'none') {
    const values = [];

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        values.push({
          label: key,
          count: data[key],
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
  }

  return null;
};

