import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [Searchquery, setSearchquery] = useState('');

  return (
    <SearchContext.Provider value={{ Searchquery, setSearchquery }}>
      {children}
    </SearchContext.Provider>
  );
};
