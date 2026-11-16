import { createContext, useContext } from 'react';

export const TradewinContext = createContext(null);

export const useTradewin = () => useContext(TradewinContext);
