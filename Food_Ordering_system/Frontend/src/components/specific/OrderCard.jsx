import { FaStore, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import Card from '../common/Card';
import OrderStatusBadge from './OrderStatusBadge';

const OrderCard = ({ order, onClick }) => {
  const { _id, restaurant, orderItems, totalPrice, status, createdAt } = order;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card hover onClick={() => onClick && onClick(order)} className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Order #{_id.slice(-8)}</p>
          <div className="flex items-center text-gray-700">
            <FaStore className="mr-2" />
            <span className="font-semibold">{restaurant?.name || 'Restaurant'}</span>
          </div>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {/* Items */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          {orderItems?.length} item{orderItems?.length > 1 ? 's' : ''}
        </p>
        <div className="text-sm text-gray-500">
          {orderItems?.slice(0, 2).map((item, index) => (
            <span key={index}>
              {item.name} x{item.qty}
              {index < Math.min(orderItems.length - 1, 1) && ', '}
            </span>
          ))}
          {orderItems?.length > 2 && ` +${orderItems.length - 2} more`}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendar className="mr-2" />
          {formatDate(createdAt)}
        </div>
        <div className="flex items-center text-lg font-bold text-primary-600">
          <FaMoneyBillWave className="mr-2" />
          ₹{totalPrice}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
