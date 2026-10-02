import React, { useState } from 'react';
import { KARACHI_TOWNS } from '../data/mockData';
import { AdListing } from '../types';

interface MarketplaceViewProps {
  ads: AdListing[];
  onSelectListing: (ad: AdListing) => void;
  onPostAdClick: () => void;
  onSwitchToModerator: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  ads,
  onSelectListing,
  onPostAdClick,
  onSwitchToModerator,
}) => {
  const [selectedTown, setSelectedTown] = useState('All Karachi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Show only approved ads in the public marketplace, plus flagged ones if intentionally searching
  const publicAds = ads.filter((ad) => {
    // only show approved or pending in public marketplace
    const isPublic = ad.status === 'approved' || ad.status === 'pending';
    const matchesTown = selectedTown === 'All Karachi' || ad.town === selectedTown;
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchQuery.toLowerCase());
    return isPublic && matchesTown && matchesCategory && matchesSearch;
  });

  const handleWhatsAppClick = (e: React.MouseEvent, ad: AdListing) => {
    e.stopPropagation();
    const phone = ad.seller.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! I saw your listing for "${ad.title}" on Karachi Bazar (PKR ${ad.price.toLocaleString()}). Is it still available in ${ad.town}?`
    );
    window.open(`https://wa.me/92${phone.slice(-10)}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Banner Alert on Marketplace */}
      <div className="px-margin pt-2 pb-1">
        <div className="bg-primary text-on-primary p-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
              verified
            </span>
            <div className="text-body-sm">
              <span className="font-label-md block">Karachi Mandi Verified Network</span>
              <span className="text-[11px] opacity-80">
                100% CNIC &amp; Sindh Excise checked ads
              </span>
            </div>
          </div>
          <button
            onClick={onSwitchToModerator}
            className="text-[11px] bg-primary-container text-on-primary px-2.5 py-1 rounded-full font-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">shield</span>
            Moderator View
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="px-margin pt-2 pb-2">
        <div className="flex items-center gap-2">
          {/* Town Selector */}
          <div className="relative shrink-0">
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="appearance-none bg-surface-container-high text-on-surface font-label-md text-label-md pl-3 pr-7 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none"
            >
              {KARACHI_TOWNS.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 top-3 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              placeholder="Search iPhone, Civic, Honda 70..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="px-margin py-1">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'mobiles', label: 'Mobiles' },
            { id: 'vehicles', label: 'Cars' },
            { id: 'bikes', label: 'Bikes' },
            { id: 'electronics', label: 'Electronics' },
            { id: 'property', label: 'Property' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 font-label-md text-label-md px-3.5 py-1.5 rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Warning */}
      <div className="px-margin py-1.5">
        <div className="bg-secondary-fixed/40 text-on-secondary-container p-2.5 rounded-xl flex items-center gap-2 text-[12px] font-body-sm border border-secondary/20">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
            shield
          </span>
          <span>
            <strong>Karachi Safety Tip:</strong> Never send token advance through Easypaisa or JazzCash. Deal face-to-face in daylight!
          </span>
        </div>
      </div>

      {/* 2-Column Marketplace Grid */}
      <div className="px-margin pt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {selectedTown === 'All Karachi' ? 'Featured in Karachi' : `Listings in ${selectedTown}`}
          </h3>
          <span className="font-body-sm text-on-surface-variant text-[12px]">
            {publicAds.length} available
          </span>
        </div>

        {publicAds.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl text-center border border-outline-variant/30 flex flex-col items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40">
              shopping_bag
            </span>
            <p className="font-label-lg text-on-surface">No listings match your search</p>
            <p className="font-body-sm text-on-surface-variant text-[12px]">
              Be the first to post an ad in {selectedTown}!
            </p>
            <button
              onClick={onPostAdClick}
              className="mt-2 bg-primary-container text-on-primary font-label-md py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Post An Ad Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-gutter">
            {publicAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => onSelectListing(ad)}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs border border-outline-variant/30 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group"
              >
                {/* 1:1 Aspect Ratio Image Box with badges */}
                <div className="w-full aspect-square bg-surface-container relative overflow-hidden">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Condition Pill */}
                  <span
                    className={`absolute top-2 left-2 font-label-sm text-[10px] px-2 py-0.5 rounded-full shadow-xs ${
                      ad.condition === 'Brand New'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-highest/90 text-on-surface backdrop-blur-xs'
                    }`}
                  >
                    {ad.condition}
                  </span>

                  {/* Verified Shield */}
                  {ad.seller.cnicVerified && (
                    <span className="absolute top-2 right-2 bg-primary-container text-on-primary p-1 rounded-full shadow-xs flex items-center justify-center">
                      <span className="material-symbols-outlined text-[13px]">
                        verified_user
                      </span>
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                  <div>
                    {/* Price */}
                    <p className="font-price-display-mobile text-price-display-mobile text-on-surface">
                      PKR {ad.price.toLocaleString()}
                    </p>

                    {/* Title */}
                    <p className="font-body-md text-on-surface text-[13px] line-clamp-2 leading-snug mt-0.5 group-hover:text-primary transition-colors">
                      {ad.title}
                    </p>
                  </div>

                  {/* Location & Time */}
                  <div className="pt-1 border-t border-outline-variant/20 flex flex-col gap-2">
                    <p className="font-body-sm text-on-surface-variant text-[11px] flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[13px] text-primary shrink-0">
                        location_on
                      </span>
                      <span className="truncate">{ad.town}</span>
                      <span>•</span>
                      <span className="shrink-0">{ad.timeAgo}</span>
                    </p>

                    {/* WhatsApp CTA */}
                    <button
                      onClick={(e) => handleWhatsAppClick(e, ad)}
                      className="w-full bg-[#25D366] text-white py-1.5 px-2 rounded-lg font-label-sm text-[11px] flex items-center justify-center gap-1 hover:opacity-90 active:scale-[0.98] transition-transform"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      Chat on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Post Ad Button on Mobile */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onPostAdClick}
          className="bg-primary-container text-on-primary font-label-md py-3 px-5 rounded-full shadow-xl flex items-center gap-2 hover:bg-primary transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Post An Ad
        </button>
      </div>
    </div>
  );
};
