import AppShell from "@/components/AppShell";
import { Check, ChevronDown, Clock3, FileCheck2, MessageSquare, MoreHorizontal, Search, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ReviewStatus = "Needs review" | "Needs update" | "Approved" | "Rejected";
type Application = { id: string; name: string; email: string; initials: string; color: string; membership: string; submitted: string; status: ReviewStatus; note: string };

const initialApplications: Application[] = [
  { id: "APP-1048", name: "Jordan Lee", email: "jordan.lee@email.com", initials: "JL", color: "#a9d9ff", membership: "Full member", submitted: "Today, 09:42", status: "Needs review", note: "New application for the 2026 membership cycle." },
  { id: "APP-1047", name: "Amina Yusuf", email: "amina.y@email.com", initials: "AY", color: "#c7f36b", membership: "Community", submitted: "Today, 08:18", status: "Needs review", note: "Identity photo is clear and ready for approval." },
  { id: "APP-1046", name: "Marcus Green", email: "marcus.g@email.com", initials: "MG", color: "#ffbea8", membership: "Full member", submitted: "Yesterday", status: "Needs update", note: "Address is missing an apartment or unit number." },
  { id: "APP-1045", name: "Priya Nair", email: "priya.nair@email.com", initials: "PN", color: "#d9b4ff", membership: "Alumni", submitted: "Yesterday", status: "Approved", note: "Approved and ready for card generation." },
  { id: "APP-1044", name: "Elliot Brooks", email: "elliot.b@email.com", initials: "EB", color: "#ffd88a", membership: "Community", submitted: "Oct 10, 2026", status: "Rejected", note: "Application did not meet the current membership criteria." },
];

const statuses: Array<"All applications" | ReviewStatus> = ["All applications", "Needs review", "Needs update", "Approved", "Rejected"];

export default function Applications() {
  const [applications, setApplications] = useState(initialApplications);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<typeof statuses[number]>("All applications");
  const [selectedId, setSelectedId] = useState(initialApplications[0].id);
  const selected = applications.find(application => application.id === selectedId) ?? applications[0];
  const filtered = useMemo(() => applications.filter(application => {
    const matchesQuery = `${application.name} ${application.email} ${application.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All applications" || application.status === filter);
  }), [applications, filter, query]);

  const review = (decision: "Approved" | "Rejected" | "Needs update") => {
    if (!selected) return;
    setApplications(current => current.map(application => application.id === selected.id ? { ...application, status: decision } : application));
    toast.success(`${selected.name}'s application marked ${decision.toLowerCase()}.`, { description: decision === "Approved" ? "Ready for card generation." : "The review queue has been updated." });
  };

  const counts = { review: applications.filter(item => item.status === "Needs review").length, update: applications.filter(item => item.status === "Needs update").length, approved: applications.filter(item => item.status === "Approved").length };

  return <AppShell title="Applications" eyebrow="Review queue" action={<button className="button button-dark" onClick={() => toast.info("Application import will connect to your intake form.")}><FileCheck2 size={16} /> Import applications</button>}>
    <div className="application-metrics"><div className="application-metric metric-attention"><span>NEEDS REVIEW</span><strong>{counts.review}</strong><small>Ready for your decision</small></div><div className="application-metric"><span>NEEDS UPDATE</span><strong>{counts.update}</strong><small>Waiting on applicant details</small></div><div className="application-metric"><span>APPROVED THIS CYCLE</span><strong>{counts.approved}</strong><small>Ready to make a card</small></div></div>
    <div className="applications-layout"><section className="application-queue"><div className="members-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search applicant or application ID" /></div><div className="select-wrap"><Clock3 size={15} /><select value={filter} onChange={event => setFilter(event.target.value as typeof filter)}>{statuses.map(status => <option key={status}>{status}</option>)}</select><ChevronDown size={15} /></div></div><div className="application-summary"><span><strong>{filtered.length}</strong> applications</span><span className="summary-sync"><i className="signal-dot" /> Updated just now</span></div><div className="application-list">{filtered.map(application => <button key={application.id} className={`application-row ${selected?.id === application.id ? "selected" : ""}`} onClick={() => setSelectedId(application.id)}><span className="member-avatar" style={{ background: application.color }}>{application.initials}</span><span className="application-copy"><strong>{application.name}</strong><small>{application.id} · {application.membership}</small></span><span className="application-date">{application.submitted}</span><span className={`status-pill ${application.status.toLowerCase().replaceAll(" ", "-")}`}>{application.status}</span><MoreHorizontal size={17} className="row-more" /></button>)}{filtered.length === 0 && <div className="empty-state"><Search size={22} /><strong>No applications found</strong><span>Try a different applicant or status.</span></div>}</div></section><aside className="application-detail"><div className="detail-topline"><span className="eyebrow">APPLICATION DETAIL</span><button className="icon-button" aria-label="More application actions" onClick={() => toast.info("More application actions are coming soon.")}><MoreHorizontal size={17} /></button></div>{selected ? <><div className="applicant-hero"><span className="member-avatar large" style={{ background: selected.color }}>{selected.initials}</span><div><h2>{selected.name}</h2><p>{selected.email}</p></div></div><div className="detail-status"><span className={`status-pill ${selected.status.toLowerCase().replaceAll(" ", "-")}`}>{selected.status}</span><span>{selected.id}</span></div><div className="detail-fields"><div><span>MEMBERSHIP</span><strong>{selected.membership}</strong></div><div><span>SUBMITTED</span><strong>{selected.submitted}</strong></div><div><span>REVIEW NOTE</span><p>{selected.note}</p></div></div><div className="detail-actions"><button className="button button-lime button-full" onClick={() => review("Approved")}><Check size={15} /> Approve & create card</button><button className="button button-border button-full" onClick={() => review("Needs update")}><MessageSquare size={15} /> Request updates</button><button className="button button-quiet button-full reject-button" onClick={() => review("Rejected")}><X size={15} /> Reject application</button></div><div className="detail-footnote"><UserRound size={14} /> Applicant records stay attached to their membership history.</div></> : <div className="empty-state"><FileCheck2 size={22} /><strong>Select an application</strong></div>}</aside></div>
  </AppShell>;
}
