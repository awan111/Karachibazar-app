import React, { useState } from 'react';
import { KARACHI_TOWNS } from '../data/mockData';
import { AdListing } from '../types';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated: (newAd: AdListing) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  onAdCreated,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState<AdListing['category']>('mobiles');
  const [condition, setCondition] = useState<AdListing['condition']>('10/10');
  const [town, setTown] = useState('Gulshan-e-Iqbal');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('Karachi Seller');
  const [sellerPhone, setSellerPhone] = useState('0300-1234567');
  const [cnicVerified, setCnicVerified] = useState(true);
  const [excisePlate, setExcisePlate] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOKdNs6gifVVeVhGQyMjHMRlTbbOizUApmrwetF5_uw3hfAWZLSxBDF6PfZOKVg-nmUWW4AcGIky_7ITRXlv-poReWK-yMyDGmVZPGUEoKsKuiA8TkdlzBUYi1FK1IbSc_5iPkYVd1k8w73VRRQW-_5lyXrAyHgmFoJG03emZajfH9zc4vqdHedzFJOBpgK5DQOvjihqF7WfaVhQdcb0d2aUGU9kvAqOtvybND13O741W1v9dJayJ'
  );

  if (!isOpen) return null;

  // Real-time market baseline check
  const numPrice = typeof price === 'number' ? price : 0;
  let marketEstimate = 0;
  let isSuspectCheap = false;

  if (category === 'mobiles' && title.toLowerCase().includes('iphone 15 pro')) {
    marketEstimate = 380000;
    if (numPrice > 0 && numPrice < 120000) {
      isSuspectCheap = true;
    }
  } else if (category === 'vehicles' && title.toLowerCase().includes('alto')) {
    marketEstimate = 2400000;
    if (numPrice > 0 && numPrice < 1000000) {
      isSuspectCheap = true;
    }
  } else if (category === 'bikes' && title.toLowerCase().includes('ybr')) {
    marketEstimate = 390000;
    if (numPrice > 0 && numPrice < 150000) {
      isSuspectCheap = true;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill in title and price.');
      return;
    }

    const discountPct = marketEstimate && numPrice < marketEstimate
      ? Math.round(((marketEstimate - numPrice) / marketEstimate) * 100)
      : undefined;

    const newAd: AdListing = {
      id: `ad-${Date.now()}`,
      title,
      price: numPrice,
      marketPrice: marketEstimate || undefined,
      discountPercentage: discountPct,
      condition,
      category,
      town,
      location: locationDetails ? `${locationDetails}, ${town}` : `${town}, Karachi`,
      timeAgo: 'Just now',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
      badgeLabel: isSuspectCheap ? 'Under Review' : 'Verified',
      status: isSuspectCheap ? 'flagged' : cnicVerified ? 'approved' : 'pending',
      reportsCount: isSuspectCheap ? 1 : 0,
      fraudAlert: isSuspectCheap
        ? {
            type: 'Easypaisa Advance Scheme Risk',
            typeUrdu: 'فراڈ کا خدشہ',
            feedback: 'Automated AI Price Integrity: Ad price is suspiciously low compared to Karachi market rate. Verification pending.',
            phoneStatus: cnicVerified ? 'Phone Verified' : 'Phone Not Verified',
            simOperator: 'Mobilink / Jazz',
            sellerName,
          }
        : undefined,
      complianceChecks: {
        exciseCheck: excisePlate
          ? {
              status: `Verified (${excisePlate})`,
              plateNumber: excisePlate,
              passed: true,
            }
          : undefined,
        aiImageMatch: {
          webStockSimilarity: '0% Web Stock Similarity',
          passed: true,
        },
        nadraStatus: {
          status: cnicVerified ? 'Pak Citizen Verified' : 'Pending CNIC Scan',
          verified: cnicVerified,
        },
      },
      seller: {
        name: sellerName,
        phone: sellerPhone,
        cnicVerified,
        rating: 5.0,
        joinedDate: 'Today',
      },
      description: description || `Original ${title} available for sale in ${town}, Karachi. Cash on delivery or hand-to-hand deal only.`,
    };

    onAdCreated(newAd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-container text-on-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">post_add</span>
            <div>
              <h2 className="font-headline-md text-headline-md">Post An Ad</h2>
              <p className="font-body-sm text-on-primary-container text-[11px]">
                Karachi Bazar Safe Classifieds Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-on-primary/10 flex items-center justify-center text-on-primary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 flex flex-col gap-4 bg-surface text-body-sm">
          {/* Category Selector */}
          <div>
            <label className="font-label-md text-on-surface block mb-1.5">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mobiles', label: 'Mobiles', icon: 'smartphone' },
                { id: 'vehicles', label: 'Cars', icon: 'directions_car' },
                { id: 'bikes', label: 'Bikes', icon: 'two_wheeler' },
                { id: 'electronics', label: 'Electronics', icon: 'devices' },
                { id: 'property', label: 'Real Estate', icon: 'apartment' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    category === cat.id
                      ? 'border-primary-container bg-primary-container/10 text-primary-container font-label-md'
                      : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {cat.icon}
                  </span>
                  <span className="text-[12px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick presets for testing */}
          <div className="bg-surface-container p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-label-md text-on-surface-variant">
              Quick Pre-Fill Karachi Ad:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setTitle('iPhone 15 Pro Max 1TB Natural');
                  setPrice(45000);
                  setCategory('mobiles');
                  setCondition('10/10');
                  setTown('Clifton');
                  setLocationDetails('Near Sea View McDonald\'s');
                  setImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDctE5-ygLS2zMnmbI_AN5CwGEDIP7uNlETNRpmOHTtRC6RH89f8XlALfQXXCyywgFEj36AdhamSNxuSmZ5VumHrgAifVxaYf4WmSbEEs7ZgGdoZKJQ_j07mj2DZPHkDrptI9QSOx9j9DPNLadekNr1CYI2cBF9kB6gZc2RuasNx2kBj3K49WHE9ch1nwneKH0LG1h5Mj0JhShXxSR8cKB2dBeNqaf0pLdCNa-9RUkgRfjwfuYakcLS');
                  setCnicVerified(false);
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-error text-on-error font-label-sm"
              >
                Simulate Scam (45k)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle('Suzuki Alto VXR 2022 1st Owner');
                  setPrice(2350000);
                  setCategory('vehicles');
                  setCondition('10/10');
                  setTown('Gulshan-e-Iqbal');
                  setLocationDetails('Block 6 near Disco Bakery');
                  setExcisePlate('BMS-412');
                  setImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuAzOKdNs6gifVVeVhGQyMjHMRlTbbOizUApmrwetF5_uw3hfAWZLSxBDF6PfZOKVg-nmUWW4AcGIky_7ITRXlv-poReWK-yMyDGmVZPGUEoKsKuiA8TkdlzBUYi1FK1IbSc_5iPkYVd1k8w73VRRQW-_5lyXrAyHgmFoJG03emZajfH9zc4vqdHedzFJOBpgK5DQOvjihqF7WfaVhQdcb0d2aUGU9kvAqOtvybND13O741W1v9dJayJ');
                  setCnicVerified(true);
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm"
              >
                Verified Alto
              </button>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Ad Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. iPhone 15 Pro Max, Suzuki Alto 2022, Yamaha YBR"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Price (PKR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 font-label-md text-on-surface-variant">
                Rs.
              </span>
              <input
                type="number"
                required
                placeholder="e.g. 45000 or 2350000"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full pl-11 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-price-display-mobile text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            {/* Live Scam / Price Risk Indicator */}
            {isSuspectCheap && (
              <div className="mt-2 p-2.5 bg-error-container text-on-error-container rounded-xl flex items-start gap-2 border border-error">
                <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
                  warning
                </span>
                <p className="text-[12px] leading-tight">
                  <strong>Urgent Price Warning:</strong> Market value is ~Rs.{' '}
                  {marketEstimate.toLocaleString()}. Selling at this price triggers automated <em>Easypaisa Token Advance Scam</em> flag and requires physical shop proof.
                </p>
              </div>
            )}
          </div>

          {/* Town & Area Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-md text-on-surface block mb-1">
                Karachi Town / Zone
              </label>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
              >
                {KARACHI_TOWNS.filter((t) => t !== 'All Karachi').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-md text-on-surface block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
              >
                <option value="Brand New">Brand New Box-Packed</option>
                <option value="10/10">10/10 Like New</option>
                <option value="9/10">9/10 Mint</option>
                <option value="8/10">8/10 Fair Condition</option>
                <option value="Used">Used / Daily Driver</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Exact Landmark / Neighborhood
            </label>
            <input
              type="text"
              placeholder="e.g. Near Disco Bakery, Block 6 or Sea View McDonald's"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          {/* Vehicle / Bike Excise Plate */}
          {(category === 'vehicles' || category === 'bikes') && (
            <div>
              <label className="font-label-md text-on-surface block mb-1">
                Excise Sindh Vehicle Registration Plate #
              </label>
              <input
                type="text"
                placeholder="e.g. BMS-412 or KHI-8890"
                value={excisePlate}
                onChange={(e) => setExcisePlate(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container uppercase"
              />
              <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                Automatically verified with Sindh Excise & Taxation Department.
              </p>
            </div>
          )}

          {/* Image URL / Selection */}
          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Photo URL / Karachi Mandi Photo
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image link or use default"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          {/* Seller & NADRA CNIC Verification */}
          <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Seller Trust &amp; Safety</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Seller Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-body-sm"
              />
              <input
                type="text"
                placeholder="0300-XXXXXXX"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-body-sm"
              />
            </div>
            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={cnicVerified}
                onChange={(e) => setCnicVerified(e.target.checked)}
                className="w-4 h-4 rounded text-primary-container focus:ring-primary-container"
              />
              <span className="text-[12px] font-label-md text-on-surface">
                Enable NADRA CNIC Level 3 Citizen Verification Badge
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="font-label-md text-on-surface block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide genuine details, reasons for selling, and preferred physical inspection spot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-sm text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant font-label-md hover:bg-surface-container rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-label-md rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Submit for Verification &amp; Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
