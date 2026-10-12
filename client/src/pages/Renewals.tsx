import AppShell from "@/components/AppShell";
import { ArrowUpRight, CalendarClock, Check, ChevronDown, CreditCard, RefreshCw, Search, ShieldAlert, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Renewal = { id: string; name: string; email: string; initials: string; color: string; memberId: string; expires: string; days: number; tier: string; replacement: boolean; renewed: boolean };
const seedRenewals: Renewal[] = [
  { id: "r1", name: "Sofia Martinez", email: "sofia.m@email.com", initials: "SM", color: "#ffbea8", memberId: "NSC-1922", expires: "May 18, 2026", days: 5, tier: "Community", replacement: true, renewed: false },
  { id: "r2", name: "Theo Brooks", email: "theo.brooks@email.com", initials: "TB", color: "#ff9eba", memberId: "NSC-1870", expires: "Apr 02, 2026", days: 12, tier: "Alumni", replacement: false, renewed: false },
  { id: "r3", name: "Priya Nair", email: "priya.nair@email.com", initials: "PN", color: "#d9b4ff", memberId: "NSC-1814", expires: "Apr 11, 2026", days: 21, tier: "Full member", replacement: true, renewed: false },
  { id: "r4", name: "Marcus Lee", email: "marcus.lee@email.com", initials: "ML", color: "#a9d9ff", memberId: "NSC-1769", expires: "Apr 26, 2026", days: 36, tier: "Community", replacement: false, renewed: false },
];

export default function Renewals() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("12 months");
  const [renewals, setRenewals] = useState(seedRenewals);
  const visible = useMemo(() => renewals.filter(member => `${member.name} ${member.memberId} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [query, renewals]);
  const renew = (id: string) => {
    setRenewals(current => current.map(member => member.id === id ? { ...member, renewed: true } : member));
    const member = renewals.find(item => item.id === id);
    toast.success(`${member?.name} renewed for ${term}.`, { description: member?.replacement ? "Replacement card queued for production." : "Membership expiry date updated." });
  };
  return <AppShell title="Renewals" eyebrow="Keep the relationship going" action={<button className="button button-dark" onClick={() => toast.success("Renewal reminder campaign queued.")}><Sparkles size={15} /> Send reminders</button>}>
    <div className="renewal-overview"><div className="renewal-overview-card renewal-highlight"><span className="eyebrow">RENEWAL RADAR</span><strong>64</strong><p>members expire in the next 30 days</p><span className="renewal-stat"><b>11 urgent</b> · next 7 days</span></div><div className="renewal-overview-card"><span className="eyebrow">THIS MONTH</span><strong>38</strong><p>members already renewed</p><span className="renewal-stat success"><b>82%</b> completion rate</span></div><div className="renewal-overview-card"><span className="eyebrow">REPLACEMENT CARDS</span><strong>17</strong><p>cards ready to reissue</p><span className="renewal-stat"><b>4</b> in production</span></div></div>
    <div className="renewal-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search expiring members" /></div><div className="renewal-term"><span>Renew by</span><div className="select-wrap"><CalendarClock size={14} /><select value={term} onChange={event => setTerm(event.target.value)}><option>12 months</option><option>6 months</option><option>24 months</option></select><ChevronDown size={14} /></div></div></div>
    <div className="renewal-section-heading"><div><span className="eyebrow">EXPIRING MEMBERS</span><h2>Give them a reason to stay.</h2></div><span className="renewal-count"><ShieldAlert size={14} /> {visible.filter(item => !item.renewed).length} need attention</span></div>
    <div className="renewal-list">{visible.map(member => <div className={`renewal-row ${member.renewed ? "renewed" : ""}`} key={member.id}><span className="member-avatar" style={{ background: member.color }}>{member.initials}</span><div className="renewal-member"><strong>{member.name}</strong><small>{member.email} · {member.memberId}</small></div><div className="renewal-expiry"><span>EXPIRES</span><strong>{member.expires}</strong><small>{member.renewed ? "Renewed just now" : `${member.days} days left`}</small></div><div className="renewal-type"><span className="tier-label">{member.tier}</span>{member.replacement && <small><CreditCard size={12} /> Replacement card</small>}</div><div className="renewal-action">{member.renewed ? <span className="renewed-label"><Check size={14} /> Renewed</span> : <button className="button button-dark button-small" onClick={() => renew(member.id)}><RefreshCw size={13} /> Renew &amp; issue</button>}<button className="icon-button" aria-label={`Open ${member.name}`} onClick={() => toast.info(`${member.name}'s renewal details are ready.`)}><ArrowUpRight size={16} /></button></div></div>)}</div>
    <div className="renewal-note"><Sparkles size={16} /><span><strong>Replacement cards stay connected.</strong> When enabled, the new card inherits the member’s history and QR verification link while the old card is automatically marked inactive.</span></div>
  </AppShell>;
}
