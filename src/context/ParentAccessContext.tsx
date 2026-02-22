import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface ParentAccessContextType {
  parentAccessExpiresAt: number | null;
  hasParentAccess: boolean;
  grantParentAccess: (durationMs?: number) => void;
  revokeParentAccess: () => void;
  isParentAccessValid: () => boolean;
  parentId: string | null;
  setParentId: (id: string | null) => void;
}

const ParentAccessContext = createContext<ParentAccessContextType | undefined>(
  undefined,
);

export const ParentAccessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [parentAccessExpiresAt, setParentAccessExpiresAt] = useState<
    number | null
  >(null);
  const [parentId, setParentId] = useState<string | null>(null);

  const isParentAccessValid = () =>
    parentAccessExpiresAt == null || Date.now() < parentAccessExpiresAt;

  const grantParentAccess = (durationMs: number = 5 * 60 * 1000) => {
    setParentAccessExpiresAt(Date.now() + durationMs);
  };

  const revokeParentAccess = () => {
    setParentAccessExpiresAt(null);
    setParentId(null);
  };

  const value = useMemo(
    () => ({
      parentAccessExpiresAt,
      hasParentAccess: isParentAccessValid(),
      grantParentAccess,
      revokeParentAccess,
      isParentAccessValid,
      parentId,
      setParentId,
    }),
    [parentAccessExpiresAt, parentId],
  );

  return (
    <ParentAccessContext.Provider value={value}>
      {children}
    </ParentAccessContext.Provider>
  );
};

export const useParentAccessContext = () => {
  const context = useContext(ParentAccessContext);
  if (!context) {
    return {
      parentAccessExpiresAt: null,
      hasParentAccess: false,
      grantParentAccess: () => {},
      revokeParentAccess: () => {},
      isParentAccessValid: () => false,
      parentId: null,
      setParentId: () => {},
    };
  }
  return context;
};
