type CardPreviewProps = {
  name: string;
  memberId: string;
  expiry: string;
  organization?: string;
  tier?: string;
  accent?: string;
  variant?: "midnight" | "clay" | "cloud";
};

export default function CardPreview({ name, memberId, expiry, organization = "NORTHSTAR CLUB", tier = "FULL MEMBER", accent = "#c7f36b", variant = "midnight" }: CardPreviewProps) {
  const qrValue = encodeURIComponent(`https://cardly.example/member/${memberId}`);
  return (
    <div className={`membership-card ${variant}`} style={{ "--card-accent": accent } as React.CSSProperties}>
      <div className="card-noise" />
      <div className="card-topline"><span className="card-brand"><span className="mini-mark"><span /></span>{organization}</span><span className="card-edition">MEMBERSHIP / 2025</span></div>
      <div className="card-mid"><div className="card-chip"><span /><span /><span /><span /></div><span className="card-signal">N° 001 / ACTIVE</span></div>
      <div className="card-bottom"><div><span className="card-kicker">{tier}</span><strong>{name || "Member name"}</strong><span className="card-id">{memberId || "CRD-0000"} <b>·</b> VALID THRU {expiry || "12 / 26"}</span></div><div className="qr-wrap"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${qrValue}`} alt="Member QR code" /><span>SCAN TO VERIFY</span></div></div>
      <div className="card-edge" />
    </div>
  );
}
