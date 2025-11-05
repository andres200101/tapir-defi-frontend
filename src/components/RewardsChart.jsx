import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

function RewardsChart({ stakedAmount }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate projected rewards data
    const generateProjections = () => {
      const data = [];
      const dailyReward = (parseFloat(stakedAmount) / 1000) * 100; // 100 TRWD per 1000 staked per day
      
      for (let i = 0; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        data.push({
          date: format(date, 'MMM dd'),
          rewards: (dailyReward * i).toFixed(2),
          projected: (dailyReward * i * 1.1).toFixed(2), // 10% optimistic projection
        });
      }
      return data;
    };

    setChartData(generateProjections());
  }, [stakedAmount]);

  return (
    <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-cyan/50 shadow-lg">
      <h3 className="text-2xl font-bold text-tapir-cyan mb-4">📈 Rewards Projection (30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#24d1dc" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#24d1dc" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#74ef93" opacity={0.1} />
          <XAxis dataKey="date" stroke="#74ef93" />
          <YAxis stroke="#74ef93" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0c6874', 
              border: '2px solid #24d1dc',
              borderRadius: '12px',
              color: '#74ef93'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="rewards" 
            stroke="#24d1dc" 
            fillOpacity={1} 
            fill="url(#colorRewards)" 
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="projected" 
            stroke="#74ef93" 
            fillOpacity={0} 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-tapir-cyan rounded mr-2"></div>
          <span className="text-tapir-green">Current Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-tapir-green mr-2"></div>
          <span className="text-tapir-green">Optimistic Projection</span>
        </div>
      </div>
    </div>
  );
}

export default RewardsChart;