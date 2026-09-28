import React, { useState, useMemo } from 'react';
import { Language, ITIInstitute } from '../types';
import { COMPLIANCE_DTEUP_ITIS } from '../data';
import {
  School,
  Search,
  Filter,
  Download,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ChevronRight,
  Database,
  Globe,
} from 'lucide-react';

interface ComplianceITIDirectoryProps {
  language: Language;
  onSelectITI?: (iti: ITIInstitute) => void;
}

export const ComplianceITIDirectory: React.FC<ComplianceITIDirectoryProps> = ({
  language,
  onSelectITI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Extract all unique zones and districts
  const zones = useMemo(() => {
    const list = Array.from(new Set(COMPLIANCE_DTEUP_ITIS.map((i) => i.zone || 'Other'))).sort();
    return ['ALL', ...list];
  }, []);

  const districts = useMemo(() => {
    const relevant = selectedZone === 'ALL'
      ? COMPLIANCE_DTEUP_ITIS
      : COMPLIANCE_DTEUP_ITIS.filter((i) => (i.zone || 'Other') === selectedZone);
    const list = Array.from(new Set(relevant.map((i) => i.district))).sort();
    return ['ALL', ...list];
  }, [selectedZone]);

  // Filtered list
  const filteredITIs = useMemo(() => {
    return COMPLIANCE_DTEUP_ITIS.filter((iti) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        iti.name.toLowerCase().includes(q) ||
        iti.code.toLowerCase().includes(q) ||
        iti.district.toLowerCase().includes(q) ||
        (iti.email && iti.email.toLowerCase().includes(q));

      const matchesZone = selectedZone === 'ALL' || iti.zone === selectedZone;
      const matchesDistrict = selectedDistrict === 'ALL' || iti.district === selectedDistrict;

      return matchesSearch && matchesZone && matchesDistrict;
    });
  }, [searchQuery, selectedZone, selectedDistrict]);

  // Export full CSV
  const handleExportCSV = () => {
    const headers = 'ITI_Code,ITI_Name,District,Zone,Official_Email,Phone,Total_Seats,Trades_Count,Address\n';
    const rows = filteredITIs
      .map(
        (i) =>
          `"${i.code}","${i.name}","${i.district}","${i.zone || ''}","${i.email || ''}","${i.phone || ''}",${i.totalSeats || 600},${i.affiliatedTradesCount || 16},"${i.address || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UP_Govt_ITIs_List_Compliance_DTEUP_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Official Data Source Banner */}
      <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" />
                {language === 'hi' ? 'आधिकारिक राज्यीय आईटीआई डेटाबेस' : 'Official State ITI Directory'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <a
                href="https://www.compliance-dteup.in"
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>www.compliance-dteup.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Live 286 Govt ITIs</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === 'hi'
                ? 'उत्तर प्रदेश समस्त 286 राजकीय आईटीआई डायरेक्टरी'
                : 'Uttar Pradesh Complete 286 Government ITIs Master List'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'प्रशिक्षण निदेशालय (DTE UP) अनुपालन पोर्टल (compliance-dteup.in) से सीधे संकलित समस्त 18 मंडलों एवं 75 जनपदों के राजकीय औद्योगिक प्रशिक्षण संस्थानों की आधिकारिक सूची, संस्थान कोड एवं अधिकृत @vppup.in ईमेल पते।'
                : 'Official directory of all 286 Government ITIs across all 18 administrative divisions and 75 districts of Uttar Pradesh compiled from the official DTE compliance portal.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'समस्त 286 ITI सूची (CSV) डाउनलोड' : 'Export 286 ITIs (CSV)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-xl font-bold font-mono text-emerald-400">286</span>
            <span className="text-slate-400">
              {language === 'hi' ? 'राजकीय आईटीआई' : 'Government ITIs'}
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-xl font-bold font-mono text-amber-400">18</span>
            <span className="text-slate-400">
              {language === 'hi' ? 'प्रशासनिक मण्डल' : 'Administrative Zones'}
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-xl font-bold font-mono text-blue-400">75</span>
            <span className="text-slate-400">
              {language === 'hi' ? 'जनपद आच्छादित' : 'Districts Covered'}
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-xl font-bold font-mono text-cyan-400">100%</span>
            <span className="text-slate-400">
              {language === 'hi' ? '@vppup.in ईमेल सक्रिय' : '@vppup.in Authenticated'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'आईटीआई का नाम, कोड (उदा: ITI-UP-001, अलीगंज), जनपद या ईमेल खोजें...'
                  : 'Search by ITI Name, Code (e.g. ITI-UP-001, Aliganj), District, or Email...'
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              {language === 'hi' ? 'मण्डल (Zone):' : 'Zone:'}
            </span>
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z === 'ALL' ? (language === 'hi' ? 'समस्त 18 मण्डल' : 'All 18 Zones') : z}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              {language === 'hi' ? 'जनपद:' : 'District:'}
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? (language === 'hi' ? 'समस्त जनपद' : 'All Districts') : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            {language === 'hi'
              ? `कुल ${filteredITIs.length} राजकीय आईटीआई प्रदर्शित (स्रोत: compliance-dteup.in)`
              : `Showing ${filteredITIs.length} of 286 Govt ITIs (Source: compliance-dteup.in)`}
          </span>
          {(searchQuery || selectedZone !== 'ALL' || selectedDistrict !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedZone('ALL');
                setSelectedDistrict('ALL');
              }}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'फ़िल्टर हटाएं (Reset)' : 'Reset Filters'}
            </button>
          )}
        </div>
      </div>

      {/* ITIs Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ITI Code</th>
                <th className="py-3 px-4">{language === 'hi' ? 'संस्थान का नाम' : 'ITI Name'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'जनपद' : 'District'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'मण्डल (Zone)' : 'Zone'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'आधिकारिक ईमेल' : 'Official Email'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'सीटें / ट्रेड्स' : 'Seats / Trades'}</th>
                <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्यवाही' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredITIs.slice(0, 100).map((iti) => (
                <tr key={iti.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleCopy(iti.code)}
                      title="Click to copy code"
                      className="font-mono font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 cursor-pointer text-[11px]"
                    >
                      {iti.code}
                      {copiedCode === iti.code && (
                        <span className="ml-1 text-[9px] text-emerald-600 font-bold">✓ Copied</span>
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                    <div className="truncate" title={iti.name}>
                      {iti.name}
                    </div>
                    {iti.address && (
                      <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5" title={iti.address}>
                        {iti.address}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {iti.district}
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {iti.zone || '—'}
                  </td>

                  <td className="py-3 px-4">
                    {iti.email ? (
                      <a
                        href={`mailto:${iti.email}`}
                        className="font-mono text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                        <span>{iti.email}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <span className="font-bold text-slate-900">{iti.totalSeats || 600}</span> seats ·{' '}
                    <span>{iti.affiliatedTradesCount || 16} trades</span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {onSelectITI && (
                      <button
                        type="button"
                        onClick={() => onSelectITI(iti)}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'चुनें' : 'Select'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredITIs.length > 100 && (
          <div className="p-3 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-200">
            {language === 'hi'
              ? `प्रारंभिक 100 परिणाम दिखाए जा रहे हैं (कुल: ${filteredITIs.length})। विशिष्ट आईटीआई खोजने हेतु ऊपर सर्च बार का उपयोग करें या पूर्ण CSV डाउनलोड करें।`
              : `Showing first 100 matching ITIs of ${filteredITIs.length}. Use search to narrow down or export full CSV.`}
          </div>
        )}

        {filteredITIs.length === 0 && (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <School className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-sm">
              {language === 'hi' ? 'कोई आईटीआई नहीं मिला' : 'No matching ITIs found'}
            </p>
            <p className="text-xs">
              {language === 'hi'
                ? 'कृपया अपने सर्च कीवर्ड या मण्डल/जनपद फ़िल्टर की जांच करें।'
                : 'Try adjusting your search query or zone/district filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
