'use client';

import TransactionCard from '@/components/transactions/TransactionCard';
import { AnimatedGrid, FadeInSection } from '@/components/transitions';
import usePostData from '@/hooks/usePostData';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  orderIdOfPlatForm: string;
  dealId: {
    _id: any;
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
  isCommissionDeal: boolean;
  orderPrice: number;
  commissionValue: number;
  deliveryFee: number;
  adminCommission: number;
  lessAmount: number;
}

interface OrderListResponse {
  orders: Transaction[];
  totalCount?: number;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);

  const { mutate: fetchOrders, isLoading } = usePostData<OrderListResponse>(
    '/user/order/getOrderList',
    {
      onSuccess: (data) => {
        setTransactions(prev => 
          currentPage === 0 ? data.orders : [...prev, ...data.orders]
        );
        setLoadMore(data.orders.length >= 10);
      },
      onError: (error) => {
        console.error('Error fetching transactions:', error);
        setLoadMore(false);
      }
    }
  );

  useEffect(() => {
    fetchOrders({
      offset: Number(currentPage) * 10,
      limit: 10,
    });
  }, [currentPage, fetchOrders]);

  const handleLoadMore = () => {
    if (loadMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
   router.push(`/orders/${transaction?._id}?dealId=${transaction.dealId._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <FadeInSection>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">My Transactions</h1>
          </div>

          {isLoading && currentPage === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">You haven't made any transactions yet.</p>
            </div>
          ) : (
            <AnimatedGrid staggerDelay={0.05}>
              {transactions.map((transaction, index) => (
                <TransactionCard 
                  key={index} 
                  transaction={transaction} 
                  onClick={() => handleTransactionClick(transaction)} 
                />
              ))}
            </AnimatedGrid>
          )}

          {loadMore && !isLoading && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleLoadMore}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
} 