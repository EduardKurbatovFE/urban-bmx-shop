'use client';

import { useMemo, useState } from 'react';
import MyData from '../MyData';
import { User } from '@/types/common';

const TABS = [
  {
    name: 'Moї данні',
    id: 'myData',
  },
  {
    name: 'Історія Замовлень',
    id: 'ordersHistory',
  },
  { name: 'Список бажань', id: 'wishList' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export const useUserTabs = (user: User) => {
  const [activeTabId, setActiveTabId] = useState<TabId>('myData');

  const handleChangeTab = (id: TabId) => {
    setActiveTabId(id);
  };

  const tabComponent = useMemo<React.ReactNode>(() => {
    switch (activeTabId) {
      case 'myData':
        return <MyData user={user} />;
      case 'ordersHistory':
        return <>hi</>;
      case 'wishList':
        return <>hi</>;
      default:
        return null;
    }
  }, [activeTabId, user]);

  return { tabs: TABS, activeTabId, tabComponent, handleChangeTab };
};
