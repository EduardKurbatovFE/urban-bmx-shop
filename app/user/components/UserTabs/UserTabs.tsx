'use client';

import { useUserTabs } from './useUserTabs';

const UserTabs = () => {
  const { tabs, handleChangeTab } = useUserTabs();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full justify-center gap-8">
        {tabs.map(({ name, id, active }) => (
          <div
            className="group relative pb-2 text-sm font-medium text-stone900 hover:opacity-80 transition-colors cursor-pointer"
            onClick={() => handleChangeTab(id)}
          >
            <p key={id} className="text-stone-900">
              {name}
            </p>

            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-stone-900 transition-all duration-200 ease-out origin-left group-hover:opacity-80
              ${active ? 'w-full scale-x-100' : 'w-full scale-x-0'}
            `}
            />
          </div>
        ))}
      </div>

      {tabs.find((tab) => tab.active)?.component}
    </div>
  );
};

export default UserTabs;
