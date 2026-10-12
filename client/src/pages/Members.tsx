import AppShell from "@/components/AppShell";
import { ArrowUpRight, ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Member = { name: string; email: string; initials: string; color: string; id: string; joined: string; expires: string; status: "Active" | "Expiring soon" | "Pending"; tier: string };
const members: Member[] = [
  { name: "Maya Chen", email: "maya.chen@email.com", initials: "MC", color: "#d9b4ff", id: "NSC-2048", joined: "Jan 12, 2024", expires: "Sep 30, 2026", status: "Active", tier: "Full member" },
  { name: "Rowan Patel", email: "rowan.patel@email.com", initials: "RP", color: "#a9d9ff", id: "NSC-2076", joined: "Oct 04, 2024", expires: "Oct 04, 2026", status: "Active", tier: "Full member" },
  { name: "Sofia Martinez", email: "sofia.m@email.com", initials: "SM", color: "#ffbea8", id: "NSC-1922", joined: "Jun 28, 2023", expires: "May 18, 2026", status: "Expiring soon", tier: "Community" },
  { name: "Daniel Okafor", email: "daniel.o@email.com", initials: "DO", color: "#c7f36b", id: "NSC-2094", joined: "Nov 16, 2024", expires: "Nov 16, 2026", status: "Active", tier: "Full member" },
  { name: "Elena Rossi", email: "elena.rossi@email.com", initials: "ER", color: "#ffd88a", id: "NSC-2101", joined: "Dec 02, 2024", expires: "Dec 02, 2026", status: "Pending", tier: "Community" },
  { name: "Theo Brooks", email: "theo.brooks@email.com", initials: "TB", color: "#ff9eba", id: "NSC-1870", joined: "Mar 21, 2023", expires: "Apr 02, 2026", status: "Expiring soon", tier: "Alumni" },
];

export default function Members() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All members" | Member["status"]>("All members");
  const filtered = useMemo(() => members.filter(member => {
    const matchesQuery = `${member.name} ${member.email} ${member.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All members" || member.status === filter);
  }), [query, filter]);
  return <AppShell title="Members" eyebrow="Your people" action={<button className="button button-dark" onClick={() => toast.success("New member flow opened.")}><Plus size={16} /> Add member</button>}>
    <div className="members-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, email, or member ID" /></div><div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option>All members</option><option>Active</option><option>Expiring soon</option><option>Pending</option></select><ChevronDown size={15} /></div><button className="button button-quiet button-border" onClick={() => toast.info("Advanced filters will be connected to saved views.")}><SlidersHorizontal size={15} /> Filters</button><button className="icon-button export-button" aria-label="Export members" onClick={() => toast.success("Member list export queued.")}><Download size={16} /></button></div></div>
    <div className="members-summary"><span><strong>{filtered.length}</strong> of 2,480 members</span><span className="summary-sync"><i className="signal-dot" /> Synced just now</span></div>
    <div className="members-table-wrap"><table className="members-table"><thead><tr><th>MEMBER</th><th>MEMBER ID</th><th>MEMBERSHIP</th><th>EXPIRES</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map(member => <tr key={member.id}><td><div className="member-cell"><span className="member-avatar" style={{ background: member.color }}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td><td><span className="member-id">{member.id}</span></td><td><span className="tier-label">{member.tier}</span><small className="joined-label">Joined {member.joined}</small></td><td><span className={member.status === "Expiring soon" ? "expiry-warn" : ""}>{member.expires}</span></td><td><span className={`status-pill ${member.status.toLowerCase().replace(" ", "-")}`}>{member.status}</span></td><td><button className="icon-button row-more" onClick={() => toast.info(`${member.name}'s profile is ready for connected member details.`)} aria-label={`Open ${member.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state"><Search size={22} /><strong>No members found</strong><span>Try a different name, email, or member ID.</span></div>}</div>
    <div className="members-footer"><span>Showing {filtered.length} members</span><div><button className="button button-quiet button-border" disabled>Previous</button><button className="button button-dark button-small" onClick={() => toast.info("You've reached the end of this demo list.")}>Next <ArrowUpRight size={14} /></button></div></div>
  </AppShell>;
}
