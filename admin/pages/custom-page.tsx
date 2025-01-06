/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { gql, useQuery } from '@keystone-6/core/admin-ui/apollo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Mall = {
  id: string;
  name: string;
  stores: Array<{
    id: string;
    name: string;
    rentAmount: number;
    payments: Array<{
      id: string;
      amount: number;
      paymentDate: string;
    }>;
  }>;
};

type ChartData = {
  name: string;
  [key: string]: string | number;
};

const GET_MALL_PAYMENTS = gql`
  query GetMallPayments {
    malls {
      id
      name
      stores {
        id
        name
        rentAmount
        payments {
          id
          amount
          paymentDate
        }
      }
    }
  }
`;

export default function CustomPage ()  {
  const { data, loading, error } = useQuery(GET_MALL_PAYMENTS);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalChartData, setTotalChartData] = useState<ChartData[]>([]);

  // Define colors for each mall
  const mallColors = [
    { expected: '#8884d8', received: '#82ca9d' },
    { expected: '#ffc658', received: '#ff8042' },
    { expected: '#0088fe', received: '#00c49f' },
    { expected: '#ff6b81', received: '#ff4757' },
    { expected: '#a8e6cf', received: '#dcedc1' },
  ];

  useEffect(() => {
    if (data?.malls) {
      const processedData = processPaymentData(data.malls);
      setChartData(processedData);

      // Process total data
      const totalData = processTotalData(data.malls);
      setTotalChartData(totalData);
    }
  }, [data]);

  const processPaymentData = (malls) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return monthNames.map(month => {
      const monthData = { name: month };
      
      malls.forEach(mall => {
        const totalRent = mall.stores.reduce((sum, store) => sum + store.rentAmount, 0);
        const monthPayments = mall.stores.reduce((sum, store) => {
          return sum + store.payments.reduce((paymentSum, payment) => {
            const paymentDate = new Date(payment.paymentDate);
            if (paymentDate.getFullYear() === currentYear && paymentDate.getMonth() === monthNames.indexOf(month)) {
              return paymentSum + payment.amount;
            }
            return paymentSum;
          }, 0);
        }, 0);

        monthData[`${mall.name} Expected`] = totalRent;
        monthData[`${mall.name} Received`] = monthPayments;
      });

      return monthData;
    });
  };

  const processTotalData = (malls: Mall[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return monthNames.map(month => {
      const monthData = { name: month };
      let totalExpected = 0;
      let totalReceived = 0;

      malls.forEach(mall => {
        const totalRent = mall.stores.reduce((sum, store) => sum + store.rentAmount, 0);
        const monthPayments = mall.stores.reduce((sum, store) => {
          return sum + store.payments.reduce((paymentSum, payment) => {
            const paymentDate = new Date(payment.paymentDate);
            if (paymentDate.getFullYear() === currentYear && paymentDate.getMonth() === monthNames.indexOf(month)) {
              return paymentSum + payment.amount;
            }
            return paymentSum;
          }, 0);
        }, 0);

        totalExpected += totalRent;
        totalReceived += monthPayments;
      });

      monthData['Total Expected'] = totalExpected;
      monthData['Total Received'] = totalReceived;
      return monthData;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <PageContainer header="Rent & Payment Dashboard">
      <div style={{ padding: '20px' }}>
        {/* Total Summary Chart */}
        <div style={{ marginBottom: '40px' }}>
          <h2>Total Rent Collection Overview</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total Expected" fill="#8884d8" />
                <Bar dataKey="Total Received" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Mall Charts */}
        <div style={{ marginTop: '40px' }}>
          <h2>Mall-wise Collection Overview</h2>
          <div style={{ display: 'grid', gap: '40px' }}>
            {data.malls.map((mall, index) => (
              <div key={mall.id}>
                <h3>{mall.name}</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey={`${mall.name} Expected`} 
                        fill={mallColors[index % mallColors.length].expected}
                      />
                      <Bar 
                        dataKey={`${mall.name} Received`} 
                        fill={mallColors[index % mallColors.length].received}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mall Summary Cards */}
        <div style={{ marginTop: '40px' }}>
          <h2>Mall-wise Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {data.malls.map(mall => (
              <div key={mall.id} style={{ 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                <h3>{mall.name}</h3>
                <p>Total Stores: {mall.stores.length}</p>
                <p>Monthly Expected Rent: ${mall.stores.reduce((sum, store) => sum + store.rentAmount, 0).toFixed(2)}</p>
                <p>This Month's Collection: ${mall.stores.reduce((sum, store) => {
                  const thisMonth = new Date().getMonth();
                  const thisYear = new Date().getFullYear();
                  return sum + store.payments.reduce((paymentSum, payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    if (paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear) {
                      return paymentSum + payment.amount;
                    }
                    return paymentSum;
                  }, 0);
                }, 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}