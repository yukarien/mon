'use client';

import { useState, useMemo } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Rating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+';
type Country = 'US' | 'JP' | 'SG' | 'AE' | 'HK' | 'EU';
type BondStatus = '受付中' | '交渉中' | 'DD実施中' | '最終条件調整';
type TokenStandard = 'ERC-3643' | 'ERC-1400' | 'FA2';

interface Bond {
  id: string;
  name: string;
  sub: string;
  country: Country;
  flag: string;
  issuance: string;
  coupon: string;
  ytm: number;
  rating: Rating;
  tenorMonths: number | null; // null = open-ended
  tenorLabel: string;
  minInvest: string;
  platform: string;
  custodian: string;
  standard: TokenStandard;
  investorType: string; // 'QIB' | 'Accredited' | 'Retail可'
  status: BondStatus;
}

interface Investor {
  id: string;
  name: string;
  sub: string;
  country: string;
  flag: string;
  sector: string;
  ticketSize: string;
  minRating: string;
  minYield: string;
  style: string;
  status: string;
}

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────
const BONDS: Bond[] = [
  {
    id: 'R01', name: 'US Treasury Token 2yr', sub: 'OUSG / BlackRock BUIDL',
    country: 'US', flag: '🇺🇸', issuance: '$10B', coupon: '4.25%',
    ytm: 4.25, rating: 'AAA', tenorMonths: 18, tenorLabel: '18ヶ月',
    minInvest: '$1,000', platform: 'Ondo Finance', custodian: 'BNY Mellon',
    standard: 'ERC-3643', investorType: 'QIB', status: '受付中',
  },
  {
    id: 'R02', name: 'JGB Token 10yr（日本国債）', sub: 'Progmat / TIS Inc.',
    country: 'JP', flag: '🇯🇵', issuance: '¥100B', coupon: '1.10%',
    ytm: 1.10, rating: 'AA+', tenorMonths: 96, tenorLabel: '96ヶ月',
    minInvest: '¥100,000', platform: 'TIS / Progmat', custodian: '信託銀行',
    standard: 'ERC-1400', investorType: '適格機関投資家', status: '受付中',
  },
  {
    id: 'R03', name: 'Singapore SGS Token 5yr', sub: 'MAS Project Guardian',
    country: 'SG', flag: '🇸🇬', issuance: 'SGD 2B', coupon: '3.00%',
    ytm: 3.20, rating: 'AAA', tenorMonths: 48, tenorLabel: '48ヶ月',
    minInvest: 'SGD 1,000', platform: 'MAS / DBS Vickers', custodian: 'DBS',
    standard: 'ERC-3643', investorType: 'Accredited', status: '受付中',
  },
  {
    id: 'R04', name: 'UAE T-Bill Token 1yr', sub: 'DIFC / Emirates NBD',
    country: 'AE', flag: '🇦🇪', issuance: 'AED 5B', coupon: '4.80%',
    ytm: 4.80, rating: 'AA', tenorMonths: 9, tenorLabel: '9ヶ月',
    minInvest: 'AED 10,000', platform: 'DIFC FinTech Hive', custodian: 'Emirates NBD',
    standard: 'ERC-3643', investorType: 'QIB', status: '受付中',
  },
  {
    id: 'R05', name: 'HKMA Exchange Fund Bill Token', sub: 'Hong Kong HKMA',
    country: 'HK', flag: '🇭🇰', issuance: 'HKD 3B', coupon: '3.87%',
    ytm: 3.87, rating: 'AA+', tenorMonths: 36, tenorLabel: '36ヶ月',
    minInvest: 'HKD 10,000', platform: 'HashKey Chain', custodian: 'HSBC',
    standard: 'ERC-3643', investorType: 'QIB', status: 'DD実施中',
  },
  {
    id: 'R06', name: 'Franklin OnChain US Gov MMF', sub: 'Franklin Templeton BENJI',
    country: 'US', flag: '🇺🇸', issuance: '$500M', coupon: '4.95%',
    ytm: 4.95, rating: 'AAA', tenorMonths: null, tenorLabel: '随時',
    minInvest: '$1', platform: 'Franklin Templeton', custodian: 'BNY Mellon',
    standard: 'ERC-1400', investorType: 'Retail可', status: '受付中',
  },
  {
    id: 'R07', name: 'EU Bund Token 5yr', sub: 'Deutsche Finance / Bundesbank',
    country: 'EU', flag: '🇪🇺', issuance: 'EUR 5B', coupon: '2.70%',
    ytm: 2.70, rating: 'AAA', tenorMonths: 60, tenorLabel: '60ヶ月',
    minInvest: 'EUR 1,000', platform: 'Clearstream D7', custodian: 'Deutsche Bank',
    standard: 'ERC-1400', investorType: 'QIB', status: '交渉中',
  },
  {
    id: 'R08', name: 'HK Retail Green Bond Token', sub: 'HKSAR / Euroclear CMU',
    country: 'HK', flag: '🇭🇰', issuance: 'HKD 800M', coupon: '3.50%',
    ytm: 3.50, rating: 'AA+', tenorMonths: 24, tenorLabel: '24ヶ月',
    minInvest: 'HKD 1,000', platform: 'Euroclear / CMU', custodian: 'HKMA',
    standard: 'FA2', investorType: 'Retail可', status: '受付中',
  },
];

const INVESTORS: Investor[] = [
  {
    id: 'I01', name: 'Hyperithum Digital Asset Mgmt', sub: '東京 / FSA登録',
    country: 'Japan', flag: '🇯🇵', sector: 'RWA / ソブリン債',
    ticketSize: '$5M–$20M', minRating: 'AA+以上', minYield: '3.0%〜',
    style: 'トークン直接購入', status: 'アクティブ',
  },
  {
    id: 'I02', name: 'SBI VC Trade', sub: '東京 / SBIグループ',
    country: 'Japan', flag: '🇯🇵', sector: 'RWA / マルチアセット',
    ticketSize: '$20M–$100M', minRating: 'AA以上', minYield: '2.5%〜',
    style: '機関投資・カストディ込', status: 'アクティブ',
  },
  {
    id: 'I03', name: 'Varys Capital', sub: 'Abu Dhabi / ADGM規制VC',
    country: 'UAE', flag: '🇦🇪', sector: 'RWA / マルチ',
    ticketSize: '$10M–$50M', minRating: 'A以上', minYield: '4.0%〜',
    style: 'LP出資 / トークン購入', status: '交渉中',
  },
  {
    id: 'I04', name: 'HashKey Capital', sub: 'Hong Kong / SFC認可',
    country: 'Hong Kong', flag: '🇭🇰', sector: 'RWA / ソブリン・社債',
    ticketSize: '$5M–$30M', minRating: 'AA+以上', minYield: '3.5%〜',
    style: 'トークン直接購入', status: 'アクティブ',
  },
  {
    id: 'I05', name: 'Actalink Ltd.', sub: 'Singapore / ActaPay',
    country: 'Singapore', flag: '🇸🇬', sector: 'RWA / フィンテックインフラ',
    ticketSize: '$1M–$5M', minRating: 'A以上', minYield: '4.5%〜',
    style: 'フィアット決済統合', status: '初期接触',
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const RATING_STYLES: Record<string, string> = {
  AAA: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  'AA+': 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  AA: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  'AA-': 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'A+': 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
};

const STATUS_STYLES: Record<string, string> = {
  '受付中': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  '交渉中': 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'DD実施中': 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  '最終条件調整': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'アクティブ': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  '初期接触': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function RatingBadge({ rating }: { rating: string }) {
  return (
    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${RATING_STYLES[rating] ?? 'bg-gray-100 text-gray-600'}`}>
      {rating}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function PlatformTag({ label }: { label: string }) {
  return (
    <span className="text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Stat cards row
// ─────────────────────────────────────────────
function StatsRow({ bonds }: { bonds: Bond[] }) {
  const avgYtm = bonds.length
    ? (bonds.reduce((s, b) => s + b.ytm, 0) / bonds.length).toFixed(2)
    : '—';

  const stats = [
    { label: '登録債券', value: `${BONDS.length}`, sub: '銘柄' },
    { label: '平均YTM（表示中）', value: `${avgYtm}%`, sub: '加重平均', accent: true },
    { label: '最低投資額', value: '$1', sub: 'Franklin BENJI より' },
    { label: '発行国数', value: '6', sub: 'カ国・地域' },
    { label: 'トークン規格', value: '3', sub: 'ERC-3643 / ERC-1400 / FA2' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-5">
      {stats.map(s => (
        <div key={s.label} className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3.5 py-3">
          <div className="text-[11px] text-gray-500 mb-1">{s.label}</div>
          <div className={`text-xl font-medium ${s.accent ? 'text-emerald-600' : ''}`}>{s.value}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Bonds table
// ─────────────────────────────────────────────
const COUNTRIES: { code: string; label: string }[] = [
  { code: 'all', label: 'すべて' },
  { code: 'US', label: '🇺🇸 米国' },
  { code: 'JP', label: '🇯🇵 日本' },
  { code: 'SG', label: '🇸🇬 Singapore' },
  { code: 'AE', label: '🇦🇪 UAE' },
  { code: 'HK', label: '🇭🇰 香港' },
  { code: 'EU', label: '🇪🇺 EU' },
];

const RATINGS_FILTER = [
  { code: 'all', label: 'すべて' },
  { code: 'AAA', label: 'AAA' },
  { code: 'AA', label: 'AA+/AA' },
  { code: 'A', label: 'A+以下' },
];

function BondsTab() {
  const [country, setCountry] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filtered = useMemo(() =>
    BONDS.filter(b => {
      const cOk = country === 'all' || b.country === country;
      const rOk = ratingFilter === 'all' ||
        (ratingFilter === 'AAA' && b.rating === 'AAA') ||
        (ratingFilter === 'AA' && ['AA+', 'AA', 'AA-'].includes(b.rating)) ||
        (ratingFilter === 'A' && !['AAA', 'AA+', 'AA', 'AA-'].includes(b.rating));
      return cOk && rOk;
    }),
    [country, ratingFilter]
  );

  return (
    <div>
      <StatsRow bonds={filtered} />

      {/* Filter row — country */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="text-[11px] text-gray-400 whitespace-nowrap">発行国：</span>
        {COUNTRIES.map(c => (
          <button
            key={c.code}
            onClick={() => setCountry(c.code)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              country === c.code
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Filter row — rating */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <span className="text-[11px] text-gray-400 whitespace-nowrap">格付け：</span>
        {RATINGS_FILTER.map(r => (
          <button
            key={r.code}
            onClick={() => setRatingFilter(r.code)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              ratingFilter === r.code
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['#','債券名 / Token Name','発行国','発行総額','表面利率','YTM','格付け','残存','最低投資','トークン発行体','規格','カストディ','ステータス'].map(h => (
                <th key={h} className="text-left py-2 px-2.5 text-[11px] uppercase tracking-wide text-gray-400 font-normal whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="py-2.5 px-2.5 font-mono text-[11px] text-gray-400">{b.id}</td>
                <td className="py-2.5 px-2.5">
                  <div className="font-medium text-[13px] leading-tight">{b.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{b.sub}</div>
                </td>
                <td className="py-2.5 px-2.5 text-base">{b.flag}</td>
                <td className="py-2.5 px-2.5 tabular-nums whitespace-nowrap">{b.issuance}</td>
                <td className="py-2.5 px-2.5 tabular-nums">{b.coupon}</td>
                <td className={`py-2.5 px-2.5 tabular-nums font-medium ${b.ytm >= 3.5 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {b.ytm.toFixed(2)}%
                </td>
                <td className="py-2.5 px-2.5"><RatingBadge rating={b.rating} /></td>
                <td className="py-2.5 px-2.5 tabular-nums whitespace-nowrap">{b.tenorLabel}</td>
                <td className="py-2.5 px-2.5 tabular-nums whitespace-nowrap">{b.minInvest}</td>
                <td className="py-2.5 px-2.5"><PlatformTag label={b.platform} /></td>
                <td className="py-2.5 px-2.5 text-[11px] text-gray-400">{b.standard}</td>
                <td className="py-2.5 px-2.5 text-[11px] text-gray-400 whitespace-nowrap">{b.custodian}</td>
                <td className="py-2.5 px-2.5"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-gray-400 border border-gray-100 dark:border-gray-800 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900">
        ⚠️ 利回りは参考値です。投資助言ではありません。Yield figures are indicative only and do not constitute investment advice.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Investors tab
// ─────────────────────────────────────────────
function InvestorsTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            {['#','投資家名','国・地域','セクター','投資規模','希望格付け','希望利回り','投資スタイル','ステータス'].map(h => (
              <th key={h} className="text-left py-2 px-2.5 text-[11px] uppercase tracking-wide text-gray-400 font-normal whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INVESTORS.map(inv => (
            <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <td className="py-2.5 px-2.5 font-mono text-[11px] text-gray-400">{inv.id}</td>
              <td className="py-2.5 px-2.5">
                <div className="font-medium text-[13px]">{inv.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{inv.sub}</div>
              </td>
              <td className="py-2.5 px-2.5 whitespace-nowrap">{inv.flag} {inv.country}</td>
              <td className="py-2.5 px-2.5 text-gray-500">{inv.sector}</td>
              <td className="py-2.5 px-2.5 tabular-nums whitespace-nowrap">{inv.ticketSize}</td>
              <td className="py-2.5 px-2.5"><RatingBadge rating={inv.minRating.replace('以上','')} /></td>
              <td className="py-2.5 px-2.5 tabular-nums text-emerald-600">{inv.minYield}</td>
              <td className="py-2.5 px-2.5 text-gray-500">{inv.style}</td>
              <td className="py-2.5 px-2.5"><StatusBadge status={inv.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// Detail cards tab
// ─────────────────────────────────────────────
function DetailTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {BONDS.map(b => (
        <div key={b.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-mono text-[11px] text-gray-400 mb-1">{b.id}</div>
              <div className="font-medium text-[13.5px] leading-snug">{b.name}</div>
              <div className="text-[12px] text-gray-400 mt-0.5">{b.flag} {b.sub}</div>
            </div>
            <RatingBadge rating={b.rating} />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-[11px] text-gray-400">YTM</div>
              <div className={`text-[17px] font-medium ${b.ytm >= 3.5 ? 'text-emerald-600' : 'text-gray-500'}`}>
                {b.ytm.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">発行総額</div>
              <div className="text-[14px] font-medium">{b.issuance}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">残存期間</div>
              <div className="text-[13px]">{b.tenorLabel}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">最低投資</div>
              <div className="text-[13px]">{b.minInvest}</div>
            </div>
          </div>

          <div className="border-t border-gray-50 dark:border-gray-800 pt-2.5 flex flex-wrap gap-1.5">
            <PlatformTag label={b.platform} />
            <PlatformTag label={b.standard} />
            <PlatformTag label={b.custodian} />
            <PlatformTag label={b.investorType} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component (drop into page.tsx or layout)
// ─────────────────────────────────────────────
type Tab = 'bonds' | 'investors' | 'detail';

export default function RwaSection() {
  const [activeTab, setActiveTab] = useState<Tab>('bonds');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'bonds', label: `RWA債券アセット（${BONDS.length}）` },
    { key: 'investors', label: `RWA投資家（${INVESTORS.length}）` },
    { key: 'detail', label: '銘柄詳細カード' },
  ];

  return (
    <section className="py-10 px-4 md:px-8 max-w-screen-xl mx-auto">

      {/* Section header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-medium">RWAトークン債券</h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Real World Assets
          </span>
        </div>
        <span className="text-[12px] text-gray-400">
          ソブリン・準ソブリン債券のオンチェーン表象 / Tokenized sovereign & quasi-sovereign bonds
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-100 dark:border-gray-800 mb-5">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-[13px] border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'border-emerald-600 text-emerald-600 font-medium'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'bonds' && <BondsTab />}
      {activeTab === 'investors' && <InvestorsTab />}
      {activeTab === 'detail' && <DetailTab />}
    </section>
  );
}
