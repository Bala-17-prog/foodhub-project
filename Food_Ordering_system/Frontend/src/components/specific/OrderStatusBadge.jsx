const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-purple-100 text-purple-800',
    'out-for-delivery': 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pending',
    preparing: 'Preparing',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

export default OrderStatusBadge;
