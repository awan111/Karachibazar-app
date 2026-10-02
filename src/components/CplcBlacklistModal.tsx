import React, { useState } from 'react';
import { CPLC_RECORDS } from '../data/mockData';
import { CplcRecord } from '../types';

interface CplcBlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord?: (record: CplcRecord) => void;
}

export const CplcBlacklistModal: React.FC<CplcBlacklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IMEI' | 'CNIC'>('ALL');

  if (!isOpen) return null;

  const filteredRecords = CPLC_RECORDS.filter((rec) => {
    const matchesQuery =
      rec.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.policeStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.offense.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || rec.type === filterType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-container text-on-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px]">local_police</span>
            <div>
              <h2 className="font-headline-md text-headline-md leading-tight">
                CPLC Karachi Blacklist Feed
              </h2>
              <p className="font-body-sm text-[11px] opacity-90">
                Sindh Police & FIA Cybercrime Integrated Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-on-primary/10 flex items-center justify-center text-on-primary"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Sync Info Banner */}
        <div className="bg-surface-container p-3 px-4 border-b border-outline-variant/30 flex items-center justify-between text-body-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
            </span>
            <span className="font-label-md text-on-surface">Auto-Synced 18m ago</span>
          </div>
          <span className="font-label-sm text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded">
            Headquarters: Governor House Gate 4
          </span>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-outline-variant/20 flex flex-col gap-2.5 bg-surface">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search Stolen IMEI, CNIC (e.g. 42101), or FIR #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="flex gap-2">
            {(['ALL', 'IMEI', 'CNIC'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full font-label-sm transition-colors ${
                  filterType === type
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {type === 'ALL' ? 'All Records' : `${type} Blacklist`}
              </button>
            ))}
          </div>
        </div>

        {/* Records List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-3 flex-1 bg-surface">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] opacity-40">gavel</span>
              <p className="font-label-md mt-2">No matching records found</p>
              <p className="font-body-sm text-[12px] opacity-75">
                The identifier is currently clear of active CPLC or Sindh Police FIRs.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-surface-container-lowest border border-error-container p-3.5 rounded-xl shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-error text-on-error font-label-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">
                        {rec.type === 'IMEI' ? 'smartphone' : 'badge'}
                      </span>
                      {rec.type} ALERT
                    </span>
                    <span className="font-label-md text-error tracking-wider">
                      {rec.firNumber}
                    </span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant text-[11px]">
                    {rec.registeredDate}
                  </span>
                </div>

                <div className="bg-surface-container/60 p-2 rounded-lg">
                  <p className="font-label-md text-on-surface font-mono tracking-wide">
                    {rec.identifier}
                  </p>
                </div>

                <div>
                  <p className="font-body-sm text-on-surface leading-snug">
                    <strong className="font-label-md text-error">Offense: </strong>
                    {rec.offense}
                  </p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    {rec.policeStation} • Rep by: {rec.reportedBy}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-outline-variant/20">
                  <span className="font-label-sm text-error bg-error-container px-2 py-0.5 rounded-full">
                    {rec.status}
                  </span>
                  <button
                    onClick={() => {
                      alert(`Forwarded ${rec.identifier} to Karachi CPLC Rapid Response Cell.`);
                    }}
                    className="font-label-sm text-primary-container hover:underline flex items-center gap-0.5"
                  >
                    <span>Dispatch to CPLC Squad</span>
                    <span className="material-symbols-outlined text-[13px]">send</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-high border-t border-outline-variant/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-container-highest hover:bg-surface-dim font-label-md text-on-surface rounded-xl transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
