'use client';

import { useState } from 'react';
import MyData from '../MyData';
import { useSession } from 'next-auth/react';

const TABS = [
  { name: 'Moї данні', active: true, id: 'myData', component: <MyData /> },
  {
    name: 'Історія Замовлень',
    active: false,
    id: 'ordersHistory',
    component: <>hi</>,
  },
  { name: 'Список бажань', active: false, id: 'wishList', component: <>hi</> },
];

type TabId = (typeof TABS)[number]['id'];
type Tab = (typeof TABS)[number];

export const useUserTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([...TABS]);
  const { data } = useSession();

  console.log(data);

  const handleChangeTab = (id: TabId) => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.id === id,
    }));

    setTabs(updatedTabs);
  };

  return { tabs, handleChangeTab };
};
