import React, { useState } from 'react';
import { ScreenMode } from '../types';

interface HeaderProps {
  currentScreen: ScreenMode;
  onScreenChange: (screen: ScreenMode) => void;
  onOpenPostAd: () => void;
  onOpenCplc: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  onOpenPostAd,
  onOpenCplc,
  onResetData,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-14 px-margin flex items-center justify-between gap-space-sm max-w-xl mx-auto w-full">
        {/* Back Button */}
        <button
          aria-label="Go Back"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
          onClick={() => {
            if (currentScreen === 'marketplace') {
              onScreenChange('moderator');
            } else {
              onScreenChange('marketplace');
            }
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Center Title with Mode Switcher */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
            <h1 className="font-headline-md text-headline-md text-on-surface truncate">
              {currentScreen === 'moderator'
                ? 'Post An Ad'
                : 'Karachi Bazar'}
            </h1>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              arrow_drop_down
            </span>
          </div>
          <span className="font-label-sm text-[10px] text-on-surface-variant -mt-0.5">
            {currentScreen === 'moderator' ? 'Moderator & Trust Mode' : 'Karachi Mandi Verified'}
          </span>
        </div>

        {/* More Menu Button */}
        <div className="relative">
          <button
            aria-label="Share or More"
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-outline-variant/20 mb-1">
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Screen Views
                  </p>
                </div>

                <button
                  onClick={() => {
                    onScreenChange('moderator');
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2.5 text-body-sm hover:bg-surface-container ${
                    currentScreen === 'moderator' ? 'text-primary font-label-md' : 'text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    admin_panel_settings
                  </span>
                  Moderator Hub (Admin)
                </button>

                <button
                  onClick={() => {
                    onScreenChange('marketplace');
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2.5 text-body-sm hover:bg-surface-container ${
                    currentScreen === 'marketplace' ? 'text-primary font-label-md' : 'text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    storefront
                  </span>
                  Karachi Bazar (Buyer View)
                </button>

                <button
                  onClick={() => {
                    onOpenPostAd();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-body-sm text-on-surface hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    post_add
                  </span>
                  Post New Ad (Safe Form)
                </button>

                <div className="my-1 border-t border-outline-variant/20" />

                <button
                  onClick={() => {
                    onOpenCplc();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-body-sm text-on-surface hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    local_police
                  </span>
                  CPLC Blacklist Feed
                </button>

                <button
                  onClick={() => {
                    onResetData();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-body-sm text-error hover:bg-error-container/40"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    restart_alt
                  </span>
                  Reset Sample Listings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
