
import React, { createContext, useContext } from 'react';
import { flowTokens } from './tokens';

const FlowContext = createContext(flowTokens);

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FlowContext.Provider value={flowTokens}>
      <div className="flow-root font-sans text-black selection:bg-blue-100 antialiased">
        {children}
      </div>
    </FlowContext.Provider>
  );
};

export const useFlow = () => useContext(FlowContext);
