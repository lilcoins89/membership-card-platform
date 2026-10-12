import AppShell from "@/components/AppShell";
import { ArrowRight, Check, ChevronDown, ClipboardList, MapPin, Package, Plus, Search, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialOrders = [
  { number: "#1048", cards: 4, members: "Maya Chen + 3", destination: "Brooklyn, NY", date: "Today, 09:37", status: "Shipped", tracking: "1Z 84X 22 0094" },
  { number: "#1047", cards: 12, members: "Northstar Club batch", destination: "Austin, TX", date: "Yesterday", status: "In production", tracking: "Printer queue" },
  { number: "#1046", cards: 8, members: "Renewal batch", destination: "Chicago, IL", date: "Mar 24, 2026", status: "Delivered", tracking: "Delivered Mar 28" },
];

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({ recipient: "", line1: "", city: "", postal: "" });
  const [query, setQuery] = useState("");
  const createOrder = () => {
    if (!address.recipient || !address.line1 || !address.city || !address.postal) {
      toast.error("Add a complete delivery address first.");
      return;
    }
    setOrders(current => [{ number: `#${1050 + current.length}`, cards: 4, members: "Maya Chen + 3", destination: `${address.city}, ${address.postal}`, date: "Just now", status: "Queued", tracking: "Awaiting printer" }, ...current]);
    setShowForm(false);
    setAddress({ recipient: "", line1: "", city: "", postal: "" });
    toast.success("Fulfillment order created.", { description: "4 cards grouped and queued for production." });
  };
  return <AppShell title="Orders & shipping" eyebrow="From approved to delivered" action={<button className="button button-dark" onClick={() => setShowForm(true)}><Plus size={15} /> Create order</button>}>
    <div className="orders-layout"><section className="orders-main"><div className="orders-summary"><div><span className="eyebrow">FULFILLMENT PIPELINE</span><h2>Every card, accounted for.</h2><p>Group generated cards into orders, capture a destination, and keep shipment progress visible.</p></div><div className="order-summary-stats"><span><strong>{orders.length}</strong><small>Recent orders</small></span><span><strong>24</strong><small>Cards in motion</small></span></div></div><div className="orders-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search order, member, or city" /></div><button className="button button-quiet button-border" onClick={() => toast.info("Courier and printer filters are ready for integration.")}><ClipboardList size={15} /> Filters</button></div><div className="orders-list">{orders.filter(order => `${order.number} ${order.members} ${order.destination}`.toLowerCase().includes(query.toLowerCase())).map(order => <div className="order-row" key={order.number}><span className={`order-icon ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status === "Shipped" ? <Truck size={17} /> : order.status === "Delivered" ? <Check size={17} /> : <Package size={17} />}</span><div className="order-primary"><strong>Order {order.number}</strong><small>{order.members} · {order.cards} cards</small></div><div className="order-destination"><span><MapPin size={13} /> {order.destination}</span><small>{order.date}</small></div><div className="order-status"><span className={`status-pill ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</span><small>{order.tracking}</small></div><button className="icon-button" aria-label={`Track ${order.number}`} onClick={() => toast.info(`${order.number}: ${order.tracking}`)}><ArrowRight size={16} /></button></div>)}</div></section><aside className="orders-side"><div className="address-card"><div className="address-card-heading"><span className="eyebrow">NEW FULFILLMENT</span><MapPin size={17} /></div><h3>Where should the cards go?</h3><p>Capture the delivery address once. We’ll keep it attached to the order.</p>{showForm ? <div className="address-form"><label>Recipient<input value={address.recipient} onChange={event => setAddress({ ...address, recipient: event.target.value })} placeholder="Maya Chen" /></label><label>Street address<input value={address.line1} onChange={event => setAddress({ ...address, line1: event.target.value })} placeholder="123 Member Lane" /></label><div className="address-row"><label>City<input value={address.city} onChange={event => setAddress({ ...address, city: event.target.value })} placeholder="Brooklyn" /></label><label>Postal code<input value={address.postal} onChange={event => setAddress({ ...address, postal: event.target.value })} placeholder="11211" /></label></div><div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)}>Cancel</button><button className="button button-dark" onClick={createOrder}>Queue order <ArrowRight size={14} /></button></div></div> : <><div className="order-batch"><div><span className="batch-count">4</span><span><strong>Cards selected</strong><small>Approved &amp; ready to produce</small></span></div><ChevronDown size={16} /></div><button className="button button-outline button-full" onClick={() => setShowForm(true)}>Add delivery address <Plus size={15} /></button></>}</div><div className="integration-card"><span className="eyebrow">READY TO CONNECT</span><strong>Production partners</strong><div><span><span className="integration-dot printer" />Card printer</span><small>Not connected</small></div><div><span><span className="integration-dot courier" />Courier tracking</span><small>Not connected</small></div><button className="subtle-link" onClick={() => toast.info("Integrations will be connected from Settings.")}>Explore connections <ArrowRight size={14} /></button></div></aside></div>
  </AppShell>;
}
