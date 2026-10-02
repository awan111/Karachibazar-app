export type ScreenMode = 'moderator' | 'marketplace' | 'post-ad';

export type ModerationFilter = 'flagged' | 'pending' | 'approved' | 'blacklist';

export interface AdListing {
  id: string;
  title: string;
  price: number;
  marketPrice?: number;
  discountPercentage?: number;
  condition: 'Brand New' | '10/10' | '9/10' | '8/10' | 'Used';
  category: 'mobiles' | 'vehicles' | 'bikes' | 'electronics' | 'property';
  location: string;
  town: string;
  timeAgo: string;
  imageUrl: string;
  badgeLabel?: string;
  status: 'flagged' | 'pending' | 'approved' | 'rejected' | 'blacklisted';
  reportsCount?: number;
  fraudAlert?: {
    type: string;
    typeUrdu: string;
    feedback: string;
    phoneStatus: string;
    simOperator: string;
    sellerName: string;
  };
  complianceChecks?: {
    exciseCheck?: {
      status: string;
      plateNumber: string;
      passed: boolean;
    };
    aiImageMatch?: {
      webStockSimilarity: string;
      passed: boolean;
    };
    nadraStatus?: {
      status: string;
      verified: boolean;
    };
  };
  spamCluster?: {
    copiesCount: number;
    titleUrdu: string;
    ipAddress: string;
    details: string;
  };
  seller: {
    name: string;
    phone: string;
    cnicVerified: boolean;
    rating?: number;
    joinedDate?: string;
  };
  description: string;
  whatsappMessage?: string;
}

export interface CplcRecord {
  id: string;
  type: 'IMEI' | 'CNIC';
  identifier: string;
  registeredDate: string;
  firNumber: string;
  policeStation: string;
  offense: string;
  reportedBy: string;
  status: 'Active Alert' | 'Recovered' | 'Quarantined';
}
