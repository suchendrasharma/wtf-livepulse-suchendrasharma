export default function RevenueCard() {
  const revenue = useStore((s) => s.revenue);

  return (
    <div className="bg-[#1A1A2E] p-4 rounded-xl">
      <h2 className="text-gray-400">Today's Revenue</h2>
      <p className="text-4xl font-bold">₹{revenue}</p>
    </div>
  );
}