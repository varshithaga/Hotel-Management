import { useState, type FormEvent } from "react";
import { updatePayment, type Payment } from "./api";

interface Props {
  payment: Payment;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditPayment({ payment, onSuccess, onCancel }: Props) {
  const [amount, setAmount] = useState(String(payment.amount));
  const [method, setMethod] = useState<Payment["method"]>(payment.method);
  const [status, setStatus] = useState<NonNullable<Payment["status"]>>(payment.status ?? "pending");
  const [transactionRef, setTransactionRef] = useState(payment.transaction_ref ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updatePayment(payment.id!, {
        amount: Number(amount),
        method,
        status,
        transaction_ref: transactionRef || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-pay-amount">Amount</label>
        <input id="edit-pay-amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-pay-method">Method</label>
        <select id="edit-pay-method" value={method} onChange={(e) => setMethod(e.target.value as Payment["method"])}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-pay-status">Status</label>
        <select
          id="edit-pay-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as NonNullable<Payment["status"]>)}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-pay-ref">Transaction Ref</label>
        <input id="edit-pay-ref" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
