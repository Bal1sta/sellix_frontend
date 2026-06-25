import s from "./styles.module.css";

const MAP = {
  published: s.badgeGreen, active: s.badgeGreen, approved: s.badgeGreen,
  paid: s.badgeGreen, completed: s.badgeGreen, delivered: s.badgeGreen, shipped: s.badgeGreen,
  draft: s.badgeGray, not_connected: s.badgeGray, archived: s.badgeGray,
  pending: s.badgeYellow, processing: s.badgeYellow, assembling: s.badgeYellow,
  in_transit: s.badgeYellow, out_of_stock: s.badgeYellow, sent_to_producer: s.badgeYellow,
  error: s.badgeRed, blocked: s.badgeRed, failed: s.badgeRed, cancelled: s.badgeRed,
};

export default function StatusBadge({ status, label }) {
  return <span className={`${s.badge} ${MAP[status] || s.badgeGray}`}>{label || status}</span>;
}
