'use client';

import React from 'react';

interface Transaction {
  orderIdOfPlatForm: string;
  dealId: {
    parentDealId?: {
      platForm?: {
        name: string;
      };
      dealCategory?: {
        name: string;
      };
      productName: string;
    };
    platForm?: {
      name: string;
    };
    dealCategory?: {
      name: string;
    };
    productName: string;
    finalCashBackForUser: number;
  };
  paymentStatus: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onClick: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const { dealId, orderIdOfPlatForm, paymentStatus } = transaction;
  
  const platformName = dealId?.parentDealId?.platForm?.name || dealId?.platForm?.name;
  const categoryName = dealId?.parentDealId?.dealCategory?.name || dealId?.dealCategory?.name;
  const productName = dealId?.parentDealId?.productName || dealId?.productName;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 mb-3 cursor-pointer"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="bg-green-100 px-3 py-1 rounded-lg">
          <span className="text-sm font-bold text-green-800">
            {platformName}
          </span>
        </div>
        <div className="bg-yellow-100 px-3 py-1 rounded-lg">
          <span className="text-sm font-bold text-yellow-800">
            {categoryName}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">
          {productName}
        </h3>
        <p className="text-sm text-gray-600">
          Return Amount: ₹{Number(dealId?.finalCashBackForUser).toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 flex-1 line-clamp-2">
          Order ID: {orderIdOfPlatForm}
        </p>
        <div 
          className={`px-3 py-1 rounded-lg text-center w-1/5 ${
            paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span className="text-xs font-medium text-white">
            {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard; 