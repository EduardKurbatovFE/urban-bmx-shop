'use client';

import React from 'react';
import AccountIcon from '@/icons/AccountIcon';
import CartIcon from '@/icons/Cart';
import SearchIcon from '@/icons/SearchIcon';
import UBSLogo from '../../assets/ubs.jpg';
import Image from 'next/image';
import { useHeader } from './use-header';
import AuthModal from '../AuthhModal';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const { user, showLoginModal, userModalAssets, toggleLoginModal } =
    useHeader();

  return (
    <div className="flex justify-center items-center bg-stone-900 min-h-40 py-4 md:max-2xl:p-6 max-md:p-6">
      <div className="flex flex-col w-1/2 gap-4 md:max-2xl:w-full max-md:w-full">
        <div className="flex justify-between items-center w-full max-md:flex-col max-md:gap-4 min-lg:gap-3">
          <div className="w-26 cursor-pointer" onClick={() => router.push('/')}>
            <Image src={UBSLogo} alt="urban_bmx_shop_logo" />
          </div>

          <div className="flex content-between items-center gap-2 bg-stone-700 p-2 w-7/12 rounded-sm">
            <input
              placeholder="Search the bets bikes, parts, and brands"
              className="outline-none text-white w-full max-sm:text-ellipsis"
              name="quickSearch"
            />
            <span>
              <SearchIcon />
            </span>
          </div>

          <div className="flex gap-4 max-[200px]:flex-col">
            <div
              className="flex gap-2 items-center cursor-pointer relative group"
              onClick={user ? undefined : toggleLoginModal}
            >
              <span className="group-hover:opacity-80">
                {user ? (
                  <div
                    className={`w-6 h-6 overflow-hidden rounded-full ${user.image ? 'block' : 'hidden'}`}
                  >
                    <img src={user.image as string} alt="userImage" />
                  </div>
                ) : (
                  <AccountIcon />
                )}
              </span>

              <p className="text-white uppercase text-sm group-hover:opacity-80 text-ellipsis">
                {user ? user.name || user.email : 'Увійти'}
              </p>

              {user && (
                <div
                  className="
                  absolute top-full left-0 mt-2
                  w-40 bg-amber-950 text-white text-sm rounded-lg shadow-lg
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200"
                >
                  <ul className="flex flex-col">
                    {userModalAssets.map(({ label, action }, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => action()}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center cursor-pointer hover:opacity-80">
              <span>
                <CartIcon />
              </span>

              <p className="text-white uppercase text-sm">Кошик</p>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && <AuthModal toggleLoginModal={toggleLoginModal} />}
    </div>
  );
};

export default Header;
