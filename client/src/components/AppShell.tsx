import { Link, useLocation } from "wouter";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Palette, Plus, RefreshCw, Settings, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AppShellProps = { children: React.ReactNode; title: string; eyebrow?: string; action?: React.ReactNode };

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/designer", label: "Card designer", icon: Palette },
];

export default function AppShell({ children, title, eyebrow = "Workspace", action }: AppShellProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (href: string) => {
    setMobileOpen(false);
    return href;
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Link href="/" className="brand-lockup" onClick={() => setMobileOpen(false)}>
            <span className="brand-mark"><span /></span>
            <span className="brand-wordmark">CARDLY</span>
          </Link>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">NC</span>
          <span className="workspace-copy"><strong>Northstar Club</strong><small>Organization workspace</small></span>
          <ChevronDown size={16} />
        </div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <span className="nav-label">Manage</span>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location === item.href;
            return <Link key={item.href} href={item.href} onClick={() => navigate(item.href)} className={`nav-item ${active ? "active" : ""}`}><Icon size={17} /><span>{item.label}</span>{active && <i />} </Link>;
          })}
          <span className="nav-label nav-label-spaced">Fulfillment</span>
          <Link href="/renewals" onClick={() => navigate("/renewals")} className={`nav-item nav-item-muted ${location === "/renewals" ? "active" : ""}`}><RefreshCw size={17} /><span>Renewals</span></Link>
          <Link href="/orders" onClick={() => navigate("/orders")} className={`nav-item nav-item-muted ${location === "/orders" ? "active" : ""}`}><span className="nav-dot dot-coral" /><span>Orders & shipping</span></Link>
          <button className="nav-item nav-item-muted" onClick={() => toast.info("Applications are connected to the review queue in the dashboard.")}><span className="nav-dot dot-lime" /><span>Applications</span></button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item nav-item-muted" onClick={() => toast.info("Settings will be available once your organization profile is connected.")}><Settings size={17} /><span>Settings</span></button>
          <div className="profile-row"><span className="profile-avatar">AK</span><span className="workspace-copy"><strong>Alex Kim</strong><small>Admin</small></span><button className="icon-button" aria-label="Sign out" onClick={() => toast.info("You're already in a secure demo workspace.")}><LogOut size={16} /></button></div>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <main className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="topbar-context"><span>Northstar Club</span><span className="crumb-slash">/</span><span>{title}</span></div>
          <div className="topbar-actions"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast.info("You're all caught up.")}><Bell size={18} /><span /></button><button className="user-chip" onClick={() => toast.info("Account settings are coming soon.")}><span className="profile-avatar small">AK</span><span>Alex</span><ChevronDown size={14} /></button></div>
        </header>
        <div className="page-content">
          <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{action}</div>
          {children}
        </div>
      </main>
    </div>
  );
}
