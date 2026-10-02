import React, { useState } from 'react';
import { AdListing } from '../types';

interface ShopProofModalProps {
  isOpen: boolean;
  ad: AdListing | null;
  onClose: () => void;
  onSubmitRequest: (adId: string, requirements: string[]) => void;
}

export const ShopProofModal: React.FC<ShopProofModalProps> = ({
  isOpen,
  ad,
  onClose,
  onSubmitRequest,
}) => {
  const [selectedReqs, setSelectedReqs] = useState<string[]>([
    'Physical Shop Front Photo with Banner',
    'Shop Rent Agreement / Allotment Deed',
    'Karachi Electronics Dealers Association (KEDA) Slip',
  ]);
  const [customNote, setCustomNote] = useState(
    'Due to high advance fee scam rates in Saddar/Clifton, please provide proof of physical retail presence before ad can be restored.'
  );

  if (!isOpen || !ad) return null;

  const toggleReq = (req: string) => {
    if (selectedReqs.includes(req)) {
      setSelectedReqs(selectedReqs.filter((r) => r !== req));
    } else {
      setSelectedReqs([...selectedReqs, req]);
    }
  };

  const handleSend = () => {
    onSubmitRequest(ad.id, selectedReqs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-highest p-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              storefront
            </span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Request Physical Shop Proof
              </h3>
              <p className="font-body-sm text-on-surface-variant text-[11px]">
                Saddar & Clifton Mobile Market Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3.5 bg-surface text-body-sm">
          <div className="bg-surface-container p-3 rounded-xl">
            <p className="font-label-md text-on-surface">{ad.title}</p>
            <p className="font-body-sm text-on-surface-variant text-[12px] mt-0.5">
              Seller: {ad.seller.name} • {ad.location}
            </p>
          </div>

          <div>
            <label className="font-label-md text-on-surface block mb-2">
              Mandatory Proof Requirements:
            </label>
            <div className="flex flex-col gap-2">
              {[
                'Physical Shop Front Photo with Banner',
                'Shop Rent Agreement / Allotment Deed',
                'Karachi Electronics Dealers Association (KEDA) Slip',
                'Live Geo-Tagged Photo from Shop Counter',
                'Utility Bill in Shop Name (KE Bill)',
              ].map((req) => (
                <label
                  key={req}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedReqs.includes(req)}
                    onChange={() => toggleReq(req)}
                    className="w-4 h-4 rounded text-primary-container focus:ring-primary-container"
                  />
                  <span className="font-body-sm text-on-surface text-[13px]">{req}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Moderator SMS / Portal Notice Note:
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-body-sm text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/30 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primary-container text-on-primary font-label-md rounded-lg shadow-sm hover:bg-primary transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">send</span>
            Dispatch Audit Notice
          </button>
        </div>
      </div>
    </div>
  );
};
