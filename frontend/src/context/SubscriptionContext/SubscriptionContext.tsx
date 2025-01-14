import { createContext, ReactNode, useContext, useMemo } from 'react';

import { useGetOrgSubscription } from '@app/hooks/api';
import { SubscriptionPlan } from '@app/hooks/api/types';

import { useWorkspace } from '../WorkspaceContext';
// import { Subscription } from '@app/hooks/api/workspace/types';

type TSubscriptionContext = {
  subscription?: SubscriptionPlan;
  isLoading: boolean;
};

const SubscriptionContext = createContext<TSubscriptionContext | null>(null);

type Props = {
  children: ReactNode;
};

export const SubscriptionProvider = ({ children }: Props): JSX.Element => {
  const { currentWorkspace } = useWorkspace();
  const { data, isLoading } = useGetOrgSubscription({
    orgID: currentWorkspace?.organization || ''
  });

  // memorize the workspace details for the context
  const value = useMemo<TSubscriptionContext>(
    () => ({
      subscription: data,
      isLoading
    }),
    [data, isLoading]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription has to be used within <SubscriptionContext.Provider>');
  }

  return ctx;
};
