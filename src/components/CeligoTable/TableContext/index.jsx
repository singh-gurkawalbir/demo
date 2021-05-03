import React, { useContext } from 'react';

export const TableContext = React.createContext({});

export const TableContextWrapper = ({value, children}) => (
  <TableContext.Provider value={value}>
    {children}
  </TableContext.Provider>
);

export const useGetTableContext = () => useContext(TableContext);
