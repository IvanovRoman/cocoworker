import { createContext, useState, useContext, type ReactNode, useReducer } from 'react';

interface UpdateContextValue {
  isUpdate: number;
  setIsUpdate: () => void;
  ownerId: number | null;
  setOwnerId: React.Dispatch<React.SetStateAction<number | null>>;
}

const UpdateContext = createContext<UpdateContextValue | undefined>(undefined);

export const UpdatedProvider = ({ children }: { children: ReactNode }) => {
  const [isUpdate, setIsUpdate] = useReducer((revision: number) => revision + 1, 0);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  return (
    <UpdateContext.Provider value={{ isUpdate, setIsUpdate, ownerId, setOwnerId }}>
      {children}
    </UpdateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUpdatedContext = () => {
  const updatedContext = useContext(UpdateContext);
  if (updatedContext === undefined) {
    throw new Error('useUpdatedContext must be inside a UpdatedProvider');
  }
  return updatedContext;
};
