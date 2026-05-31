import Checkout from "./checkout";

export default function PaymentsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h2>Payments</h2>
      <p>Example: pay for premium template</p>
      <Checkout amount={100} />
    </main>
  );
}
