import React, { createContext, useReducer } from 'react';
import { SnackbarType } from '../types';
import reducer, { TAction } from '../utils/reducer';
import Snackbar from '../Snackbar';

export const SnackbarContext = createContext<{
  queue: SnackbarType[];
  dispatch: React.Dispatch<TAction>;
}>({
  queue: [] as SnackbarType[],
  dispatch: () => {},
});

export default function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ queue }, dispatch] = useReducer(reducer, { queue: [] });
  return (
    <SnackbarContext.Provider value={{ queue, dispatch }}>
      {queue.map((snack, index) => (
        <Snackbar
          key={snack.key}
          className={`-mt-${index + 1} left-${index + 4}`}
          variant={snack.variant}
          handleClose={() =>
            dispatch({ type: 'REMOVE_SNACKBAR', payload: { key: snack.key } })
          }
          text={snack.text}
        />
      ))}
      {children}
    </SnackbarContext.Provider>
  );
}
