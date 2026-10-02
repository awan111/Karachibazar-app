import React, { useState } from 'react';
import { AdListing } from '../types';

interface ModeratorHubProps {
  ads: AdListing[];
  onAction: (cardId: string, actionType: string, customMessage?: string) => void;
  onRequestShopProof: (ad: AdListing) => void;
  onOpenCplcFeed: () => void;
  onSelectListing: (ad: AdListing) => void;
}

export const ModeratorHub: React.FC<ModeratorHubProps> = ({
  ads,
  onAction,
  onRequestShopProof,
  onOpenCplcFeed,
  onSelectListing,
}) => {
  const [activeFilter, setActiveFilter] = useState<'flagged' | 'pending' | 'approved' | 'blacklist'>('flagged');

  // Filter listings based on active filter
  const displayedAds = ads.filter((ad) => {
    if (activeFilter === 'flagged') return ad.status === 'flagged';
    if (activeFilter === 'pending') return ad.status === 'pending';
    if (activeFilter === 'approved') return ad.status === 'approved';
    if (activeFilter === 'blacklist') return ad.status === 'blacklisted';
    return true;
  });

  const flaggedCount = ads.filter((a) => a.status === 'flagged').length;
  const pendingCount = ads.filter((a) => a.status === 'pending').length;
  const approvedCount = ads.filter((a) => a.status === 'approved').length;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Moderator Header Profile / Status Card */}
      <div className="px-margin pt-2 pb-3">
        <div className="bg-surface-container-highest p-space-md rounded-xl shadow-xs flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
              </span>
              <span className="font-label-sm text-label-sm text-error uppercase tracking-wider">
                Moderator Mode • Active
              </span>
            </div>
            <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified_user</span>
              CNIC Level 3
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Karachi Bazar Admin
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  shield_person
                </span>
                Lead City Moderator (کراچی زون)
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-lg text-label-lg shadow-xs">
              KZ
            </div>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Carousel / Bento */}
      <div className="px-margin py-1">
        <div className="grid grid-cols-2 gap-gutter">
          {/* Reported / Flagged (High Priority) */}
          <div
            onClick={() => setActiveFilter('flagged')}
            className={`p-space-md rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all ${
              activeFilter === 'flagged'
                ? 'bg-error-container text-on-error-container ring-2 ring-error'
                : 'bg-error-container text-on-error-container opacity-90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-error">
                report_problem
              </span>
              <span className="font-label-sm text-label-sm bg-error text-on-error px-1.5 py-0.5 rounded-full">
                Scam Alert
              </span>
            </div>
            <div className="mt-2">
              <p className="font-price-display-mobile text-price-display-mobile text-error">
                {flaggedCount} Ads
              </p>
              <p className="font-label-sm text-label-sm text-on-error-container opacity-90 mt-0.5">
                Reported / مشکوک اشتہارات
              </p>
            </div>
          </div>

          {/* Pending Verification */}
          <div
            onClick={() => setActiveFilter('pending')}
            className={`p-space-md rounded-xl shadow-xs flex flex-col justify-between cursor-pointer transition-all ${
              activeFilter === 'pending'
                ? 'bg-surface-container-high text-on-surface ring-2 ring-primary-container'
                : 'bg-surface-container-high text-on-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                pending_actions
              </span>
              <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full">
                Manual
              </span>
            </div>
            <div className="mt-2">
              <p className="font-price-display-mobile text-price-display-mobile text-on-surface">
                {pendingCount} Ads
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                Pending Review / زیرِ غور
              </p>
            </div>
          </div>

          {/* Auto-Approved (AI Verified) */}
          <div
            onClick={() => setActiveFilter('approved')}
            className={`p-space-md rounded-xl shadow-xs flex flex-col justify-between cursor-pointer transition-all ${
              activeFilter === 'approved'
                ? 'bg-surface-container text-on-surface ring-2 ring-primary-container'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-primary-container">
                auto_awesome
              </span>
              <span className="font-label-sm text-label-sm bg-primary-fixed-dim text-on-primary-fixed-variant px-1.5 py-0.5 rounded-full">
                99.4%
              </span>
            </div>
            <div className="mt-2">
              <p className="font-price-display-mobile text-price-display-mobile text-on-surface">
                {approvedCount + 180} Today
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                Auto-Approved / منظور شدہ
              </p>
            </div>
          </div>

          {/* Banned CNIC / Blacklist */}
          <div
            onClick={() => onOpenCplcFeed()}
            className="bg-surface-container text-on-surface p-space-md rounded-xl shadow-xs flex flex-col justify-between cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-error">block</span>
              <span className="font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded-full">
                Sindh Police sync
              </span>
            </div>
            <div className="mt-2">
              <p className="font-price-display-mobile text-price-display-mobile text-on-surface">
                3 Sellers
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                Blacklisted / بلیک لسٹ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Segment Control */}
      <div className="px-margin pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveFilter('flagged')}
            className={`shrink-0 font-label-md text-label-md px-3.5 py-2 rounded-full shadow-xs flex items-center gap-1.5 transition-colors ${
              activeFilter === 'flagged'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            Flagged &amp; Reports ({flaggedCount})
          </button>

          <button
            onClick={() => setActiveFilter('pending')}
            className={`shrink-0 font-label-md text-label-md px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors ${
              activeFilter === 'pending'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            Pending Review ({pendingCount})
          </button>

          <button
            onClick={() => setActiveFilter('approved')}
            className={`shrink-0 font-label-md text-label-md px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors ${
              activeFilter === 'approved'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Recent Approvals
          </button>

          <button
            onClick={() => onOpenCplcFeed()}
            className="shrink-0 bg-surface-container-high text-on-surface-variant font-label-md text-label-md px-3.5 py-2 rounded-full flex items-center gap-1.5 hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">person_off</span>
            Blacklist (CNIC)
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      <div className="px-margin py-2">
        <div className="bg-secondary-container text-on-secondary-container p-space-sm px-3 rounded-lg flex items-center justify-between text-body-sm font-body-sm shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>High fraud activity reported in Saddar &amp; Clifton zones today.</span>
          </div>
          <span className="font-label-sm text-label-sm bg-surface-container-lowest/30 px-1.5 py-0.5 rounded">
            Live
          </span>
        </div>
      </div>

      {/* Moderation Cards Stream */}
      <div className="px-margin flex flex-col gap-4 mt-2">
        {displayedAds.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-xl text-center flex flex-col items-center gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[40px] text-primary-container">
              task_alt
            </span>
            <p className="font-headline-md text-on-surface">Queue Cleared</p>
            <p className="font-body-sm text-on-surface-variant">
              No listings currently pending under this filter. All Karachi zone reports have been processed.
            </p>
            <button
              onClick={() => setActiveFilter('flagged')}
              className="mt-2 text-primary-container font-label-md underline"
            >
              Reset to Flagged Feed
            </button>
          </div>
        ) : (
          displayedAds.map((ad) => {
            // Render Card 1 style (Scam flag with Easypaisa scheme)
            if (ad.id === 'ad-card-1') {
              return (
                <div
                  key={ad.id}
                  id={ad.id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-md flex flex-col gap-3 transition-all duration-300"
                >
                  {/* Card Status Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">dangerous</span>
                        Advance Scam Flag
                      </span>
                      <span className="text-error font-body-sm text-body-sm">
                        {ad.reportsCount || 4} Reports
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {ad.timeAgo}
                    </span>
                  </div>

                  {/* Product & Image Info */}
                  <div
                    onClick={() => onSelectListing(ad)}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        src={ad.imageUrl}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-surface-container-highest/90 text-on-surface font-label-sm text-label-sm px-1 rounded">
                        {ad.badgeLabel || '1TB Box'}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary">
                        {ad.title}
                      </p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-price-display-mobile text-price-display-mobile text-error">
                          PKR {ad.price.toLocaleString()}
                        </span>
                        {ad.marketPrice && (
                          <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                            Market: ~3.8L
                          </span>
                        )}
                      </div>
                      <p className="font-label-sm text-label-sm text-error bg-error-container text-on-error-container px-1.5 py-0.5 rounded mt-1.5 inline-block w-fit">
                        {ad.discountPercentage || 92}% Below Average Market Price
                      </p>
                    </div>
                  </div>

                  {/* Scam Narrative & Karachi Context Alert */}
                  {ad.fraudAlert && (
                    <div className="bg-error-container/60 p-3 rounded-lg text-on-surface flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 font-label-md text-label-md text-error">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        <span>{ad.fraudAlert.typeUrdu} / {ad.fraudAlert.type}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                        Buyer feedback:{' '}
                        <span className="font-label-md text-label-md">
                          "{ad.fraudAlert.feedback}"
                        </span>
                      </p>
                      <div className="flex items-center gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-1 text-error">
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          {ad.fraudAlert.phoneStatus}
                        </span>
                        <span>•</span>
                        <span>Sim: {ad.fraudAlert.simOperator}</span>
                        <span>•</span>
                        <span>Seller: '{ad.fraudAlert.sellerName}'</span>
                      </div>
                    </div>
                  )}

                  {/* Moderation CTAs */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-error text-on-error font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs active:opacity-90 transition-transform active:scale-[0.98]"
                        onClick={() => onAction(ad.id, 'banned')}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[17px]">gavel</span>
                        Block &amp; Ban CNIC
                      </button>
                      <button
                        className="bg-surface-container-high text-on-surface font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 active:bg-surface-container-highest transition-colors"
                        onClick={() => onAction(ad.id, 'deleted')}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                        Delete Listing
                      </button>
                    </div>
                    <button
                      className="bg-surface-container text-primary font-label-md text-label-md py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
                      onClick={() => onRequestShopProof(ad)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">fact_check</span>
                      Request Physical Shop Proof (Saddar/Clifton)
                    </button>
                  </div>
                </div>
              );
            }

            // Render Card 2 style (High-value verification Suzuki Alto)
            if (ad.id === 'ad-card-2') {
              return (
                <div
                  key={ad.id}
                  id={ad.id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-md flex flex-col gap-3 transition-all duration-300"
                >
                  {/* Status Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">policy</span>
                        High-Value Verification
                      </span>
                      <span className="text-primary-container font-label-sm text-label-sm">
                        {ad.town || 'Gulshan-e-Iqbal Block 6'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {ad.timeAgo}
                    </span>
                  </div>

                  {/* Car Details */}
                  <div
                    onClick={() => onSelectListing(ad)}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        src={ad.imageUrl}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1 left-1 bg-primary text-on-primary font-label-sm text-label-sm px-1 rounded flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">check</span> Genuine
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary">
                        {ad.title}
                      </p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-price-display-mobile text-price-display-mobile text-on-surface">
                          PKR {ad.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
                        Mileage: 28,000 km • Bumper to Bumper Genuine
                      </p>
                    </div>
                  </div>

                  {/* Automated Compliance Indicators */}
                  <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between text-body-sm font-body-sm">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-tertiary-container">
                          verified
                        </span>
                        Excise Sindh Database Check
                      </span>
                      <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full">
                        Passed (BMS-412)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-body-sm font-body-sm">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-primary-container">
                          camera_alt
                        </span>
                        AI Duplicate Image Match
                      </span>
                      <span className="font-label-sm text-label-sm bg-surface-container-highest text-on-surface px-2 py-0.5 rounded-full">
                        0% Web Stock Similarity
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-body-sm font-body-sm">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          badge
                        </span>
                        NADRA CNIC Seller Status
                      </span>
                      <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                        Pak Citizen Verified
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      className="col-span-2 bg-primary-container text-on-primary font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs active:bg-primary transition-colors"
                      onClick={() => onAction(ad.id, 'approved')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      Approve &amp; Publish Live
                    </button>
                    <button
                      className="bg-surface-container-high text-error font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 active:bg-surface-container-highest transition-colors"
                      onClick={() => onAction(ad.id, 'rejected')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">close</span>
                      Reject
                    </button>
                  </div>
                </div>
              );
            }

            // Render Card 3 style (Duplicate IP cluster Yamaha bike)
            if (ad.id === 'ad-card-3') {
              return (
                <div
                  key={ad.id}
                  id={ad.id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-md flex flex-col gap-3 transition-all duration-300"
                >
                  {/* Status Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">
                          content_copy
                        </span>
                        IP Cluster Spam (5 Ads)
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {ad.timeAgo}
                    </span>
                  </div>

                  {/* Bike Info */}
                  <div
                    onClick={() => onSelectListing(ad)}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        src={ad.imageUrl}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 left-1 bg-surface-container-highest/90 text-on-surface font-label-sm text-label-sm px-1 rounded">
                        5 Copies
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary">
                        {ad.title}
                      </p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-price-display-mobile text-price-display-mobile text-on-surface">
                          PKR {ad.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary font-label-md mt-1 truncate">
                        {ad.location}
                      </p>
                    </div>
                  </div>

                  {/* Duplicate Diagnostic Insight */}
                  {ad.spamCluster && (
                    <div className="bg-secondary-fixed/30 p-3 rounded-lg text-on-surface flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-secondary">
                          {ad.spamCluster.titleUrdu}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {ad.spamCluster.ipAddress}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface leading-tight mt-1">
                        {ad.spamCluster.details}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      className="bg-secondary text-on-secondary font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs active:opacity-90 transition-transform active:scale-[0.98]"
                      onClick={() => onAction(ad.id, 'merged')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">merge_type</span>
                      Merge &amp; Keep 1 Post
                    </button>
                    <button
                      className="bg-surface-container-high text-error font-label-md text-label-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 active:bg-surface-container-highest transition-colors"
                      onClick={() => onAction(ad.id, 'purged')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
                      Purge All 5 Ads
                    </button>
                  </div>
                </div>
              );
            }

            // Generic Card for custom added or filtered listings
            return (
              <div
                key={ad.id}
                id={ad.id}
                className="bg-surface-container-lowest p-4 rounded-xl shadow-md flex flex-col gap-3 transition-all duration-300"
              >
                <div className="flex items-center justify-between pb-1">
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      ad.status === 'approved'
                        ? 'bg-primary-container text-on-primary'
                        : ad.status === 'pending'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error text-on-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {ad.status === 'approved'
                        ? 'verified'
                        : ad.status === 'pending'
                        ? 'schedule'
                        : 'warning'}
                    </span>
                    {ad.status.toUpperCase()}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {ad.timeAgo}
                  </span>
                </div>

                <div
                  onClick={() => onSelectListing(ad)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src={ad.imageUrl}
                      alt={ad.title}
                      referrerPolicy="no-referrer"
                    />
                    {ad.badgeLabel && (
                      <span className="absolute bottom-1 right-1 bg-surface-container-highest/90 text-on-surface font-label-sm px-1 rounded">
                        {ad.badgeLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary">
                      {ad.title}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-price-display-mobile text-price-display-mobile text-on-surface">
                        PKR {ad.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
                      {ad.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {ad.status !== 'approved' && (
                    <button
                      className="flex-1 bg-primary-container text-on-primary font-label-md py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                      onClick={() => onAction(ad.id, 'approved')}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Approve
                    </button>
                  )}
                  <button
                    className="flex-1 bg-surface-container-high text-error font-label-md py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                    onClick={() => onAction(ad.id, 'deleted')}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Karachi Local City Emergency Notice & Escalation Bar */}
      <div className="px-margin pt-6">
        <div className="bg-surface-container-high p-4 rounded-xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">local_police</span>
          </div>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg text-on-surface">
              Sindh FIA Cybercrime Sync
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Confirmed criminal CNICs and stolen IMEI mobile database are automatically updated every 6 hours from CPLC Karachi headquarters.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={onOpenCplcFeed}
                className="font-label-md text-label-md text-primary-container flex items-center gap-1 hover:underline"
                type="button"
              >
                <span>View CPLC Blacklist Feed</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
