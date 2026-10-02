import React from 'react';
import { AdListing } from '../types';

interface ListingDetailModalProps {
  ad: AdListing | null;
  onClose: () => void;
  onOpenWhatsApp?: (ad: AdListing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  ad,
  onClose,
  onOpenWhatsApp,
}) => {
  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              verified
            </span>
            <span className="font-label-md text-on-surface">Listing Details</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {/* Main Image */}
          <div className="w-full h-64 bg-surface-container rounded-xl overflow-hidden relative">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {ad.badgeLabel && (
              <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm px-2 py-0.5 rounded shadow">
                {ad.badgeLabel}
              </span>
            )}
            <span className="absolute bottom-2 right-2 bg-surface-container-highest/90 text-on-surface font-label-sm px-2 py-0.5 rounded">
              Condition: {ad.condition}
            </span>
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-price-display-mobile text-[24px] text-primary">
                PKR {ad.price.toLocaleString()}
              </span>
              {ad.marketPrice && (
                <span className="text-body-sm text-on-surface-variant line-through">
                  Market: PKR {ad.marketPrice.toLocaleString()}
                </span>
              )}
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
              {ad.title}
            </h2>
            <p className="font-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-primary">
                location_on
              </span>
              {ad.location} • {ad.timeAgo}
            </p>
          </div>

          {/* Seller Trust Profile */}
          <div className="bg-surface-container-high p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-lg">
                {ad.seller.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-label-md text-on-surface flex items-center gap-1">
                  {ad.seller.name}
                  {ad.seller.cnicVerified && (
                    <span className="material-symbols-outlined text-primary text-[15px]">
                      verified_user
                    </span>
                  )}
                </p>
                <p className="font-body-sm text-on-surface-variant text-[12px]">
                  {ad.seller.cnicVerified
                    ? 'NADRA CNIC Verified Seller'
                    : 'Unverified Mobile Seller'}
                </p>
              </div>
            </div>
            <span className="font-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
              {ad.town}
            </span>
          </div>

          {/* Fraud Protection Advisory */}
          <div className="bg-secondary-fixed/30 border border-secondary/30 p-3 rounded-xl flex items-start gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
              security
            </span>
            <div className="text-body-sm text-on-surface">
              <p className="font-label-md text-secondary">Karachi Safe Exchange Advisory</p>
              <p className="text-[12px] mt-0.5 opacity-90">
                Never send token money or advance booking via Easypaisa or JazzCash. Always inspect items physically at high-visibility public spots (e.g. Dolmen Mall Clifton, Lucky One, or Millenium Mall).
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-label-md text-on-surface mb-1">Description</h4>
            <p className="font-body-md text-on-surface-variant text-[14px] leading-relaxed whitespace-pre-line bg-surface-container p-3 rounded-xl">
              {ad.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3.5 bg-surface-container-high border-t border-outline-variant/30 flex items-center gap-2">
          <button
            onClick={() => onOpenWhatsApp?.(ad)}
            className="flex-1 bg-[#25D366] text-white font-label-md py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-95"
          >
            <span className="material-symbols-outlined text-[19px]">chat</span>
            Chat on WhatsApp with Seller
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-surface-container-highest text-on-surface font-label-md rounded-xl hover:bg-surface-dim"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
