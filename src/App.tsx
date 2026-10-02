import { useState } from 'react';
import { CplcBlacklistModal } from './components/CplcBlacklistModal';
import { Header } from './components/Header';
import { ListingDetailModal } from './components/ListingDetailModal';
import { MarketplaceView } from './components/MarketplaceView';
import { ModeratorHub } from './components/ModeratorHub';
import { PostAdModal } from './components/PostAdModal';
import { ShopProofModal } from './components/ShopProofModal';
import { Toast } from './components/Toast';
import { INITIAL_ADS } from './data/mockData';
import { AdListing, ScreenMode } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('moderator');
  const [ads, setAds] = useState<AdListing[]>(INITIAL_ADS);
  const [selectedListing, setSelectedListing] = useState<AdListing | null>(null);
  const [shopProofTarget, setShopProofTarget] = useState<AdListing | null>(null);
  const [isCplcModalOpen, setIsCplcModalOpen] = useState(false);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('Listing action executed successfully');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  // Moderator actions on listings
  const handleAction = (cardId: string, actionType: string) => {
    const messages: Record<string, string> = {
      banned: 'Seller CNIC blocked & phone blacklisted in Karachi zone.',
      deleted: 'Ad removed immediately from Karachi Bazar feeds.',
      approved: 'Ad approved and published live in Gulshan-e-Iqbal.',
      rejected: 'Ad rejected. Reason notification dispatched to user via SMS.',
      merged: 'Duplicate cluster merged into single active ad.',
      purged: '5 duplicate postings removed across Orangi Town IP range.',
    };

    showToast(messages[actionType] || 'Action recorded successfully');

    // Update ads state
    setAds((prev) => {
      if (actionType === 'banned' || actionType === 'deleted' || actionType === 'purged') {
        return prev.filter((a) => a.id !== cardId);
      }
      if (actionType === 'approved') {
        return prev.map((a) =>
          a.id === cardId
            ? { ...a, status: 'approved', timeAgo: 'Approved just now' }
            : a
        );
      }
      if (actionType === 'rejected') {
        return prev.filter((a) => a.id !== cardId);
      }
      if (actionType === 'merged') {
        return prev.map((a) =>
          a.id === cardId
            ? {
                ...a,
                badgeLabel: '1 Merged Post',
                reportsCount: 0,
                spamCluster: undefined,
                status: 'pending',
              }
            : a
        );
      }
      return prev;
    });
  };

  const handleRequestShopProof = (ad: AdListing) => {
    setShopProofTarget(ad);
  };

  const handleDispatchShopProof = (adId: string, requirements: string[]) => {
    showToast(`Audit notice sent with ${requirements.length} requirements. Seller notified via SMS.`);
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, badgeLabel: 'Shop Proof Req' } : a))
    );
  };

  const handleAdCreated = (newAd: AdListing) => {
    setAds([newAd, ...ads]);
    if (newAd.status === 'flagged') {
      showToast('⚠️ Suspicious price detected! Ad routed to Karachi Moderator Queue for token review.');
      setCurrentScreen('moderator');
    } else {
      showToast('Ad submitted! Verified with NADRA citizen registry & published.');
      setCurrentScreen('marketplace');
    }
  };

  const handleResetData = () => {
    setAds(INITIAL_ADS);
    showToast('Sample listings restored to initial Karachi Bazar demo state.');
  };

  const flaggedCount = ads.filter((a) => a.status === 'flagged').length;
  const pendingCount = ads.filter((a) => a.status === 'pending').length;

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onOpenPostAd={() => setIsPostAdModalOpen(true)}
        onOpenCplc={() => setIsCplcModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-14 pb-safe bg-surface min-h-screen max-w-xl mx-auto">
        {/* Screen Switcher Pills */}
        <div className="px-margin pt-2 pb-1 flex items-center justify-between">
          <div className="bg-surface-container-high p-1 rounded-full flex gap-1 text-[12px] font-label-md w-full">
            <button
              onClick={() => setCurrentScreen('moderator')}
              className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                currentScreen === 'moderator'
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              Moderator Hub
              {(flaggedCount > 0 || pendingCount > 0) && (
                <span className="bg-error text-on-error text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {flaggedCount + pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentScreen('marketplace')}
              className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
                currentScreen === 'marketplace'
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Karachi Bazar
            </button>
          </div>
        </div>

        {/* Dynamic Screen View */}
        {currentScreen === 'moderator' ? (
          <ModeratorHub
            ads={ads}
            onAction={handleAction}
            onRequestShopProof={handleRequestShopProof}
            onOpenCplcFeed={() => setIsCplcModalOpen(true)}
            onSelectListing={setSelectedListing}
          />
        ) : (
          <MarketplaceView
            ads={ads}
            onSelectListing={setSelectedListing}
            onPostAdClick={() => setIsPostAdModalOpen(true)}
            onSwitchToModerator={() => setCurrentScreen('moderator')}
          />
        )}
      </main>

      {/* Persistent Bottom Bar for Mobile Ergonomics */}
      <nav className="fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 py-2 px-6 z-40 max-w-xl mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen('moderator')}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-label-md transition-colors ${
              currentScreen === 'moderator'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">gavel</span>
            <span>Moderator</span>
          </button>

          <button
            onClick={() => setCurrentScreen('marketplace')}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-label-md transition-colors ${
              currentScreen === 'marketplace'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">storefront</span>
            <span>Karachi Bazar</span>
          </button>

          <button
            onClick={() => setIsPostAdModalOpen(true)}
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <span className="text-[10px] font-label-md text-primary mt-1">Post Ad</span>
          </button>

          <button
            onClick={() => setIsCplcModalOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[11px] font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">local_police</span>
            <span>CPLC Sync</span>
          </button>

          <button
            onClick={() => {
              if (ads.length === 0) {
                handleResetData();
              } else {
                showToast(`Karachi Bazar Active: ${ads.length} listings in database.`);
              }
            }}
            className="flex flex-col items-center gap-0.5 text-[11px] font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">sync</span>
            <span>Live Data</span>
          </button>
        </div>
      </nav>

      {/* Modals & Dialogs */}
      <CplcBlacklistModal
        isOpen={isCplcModalOpen}
        onClose={() => setIsCplcModalOpen(false)}
      />

      <ShopProofModal
        isOpen={!!shopProofTarget}
        ad={shopProofTarget}
        onClose={() => setShopProofTarget(null)}
        onSubmitRequest={handleDispatchShopProof}
      />

      <PostAdModal
        isOpen={isPostAdModalOpen}
        onClose={() => setIsPostAdModalOpen(false)}
        onAdCreated={handleAdCreated}
      />

      <ListingDetailModal
        ad={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOpenWhatsApp={(ad) => {
          const phone = ad.seller.phone.replace(/[^0-9]/g, '');
          const text = encodeURIComponent(
            `Assalam-o-Alaikum! Inquiring about "${ad.title}" on Karachi Bazar (PKR ${ad.price.toLocaleString()}).`
          );
          window.open(`https://wa.me/92${phone.slice(-10)}?text=${text}`, '_blank');
        }}
      />

      {/* Floating Action Feedback Toast */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}
