export default {
  columns: () => {
    const columns = [
      {
        heading: 'Type',
        value: r => {
          let toReturn = r.type;

          if (toReturn) {
            if (toReturn.indexOf('share') > -1) {
              toReturn = `${toReturn.charAt(0)}
                ${toReturn.charAt(1).toUpperCase()}
                ${toReturn.substr(2, toReturn.length - 3)}`;
            } else if (toReturn === 'iclients') {
              toReturn = 'iClient';
            } else {
              toReturn = `${toReturn.charAt(0).toUpperCase()}
                ${toReturn.substr(1, toReturn.length - 2)}`;
            }
          }

          return toReturn;
        },
        orderBy: 'name',
      },
      {
        heading: 'Name',
        value: r => r.name || r._id,
      },
    ];

    return columns;
  },
};
