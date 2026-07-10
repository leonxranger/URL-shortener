import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip } from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip)


const Graph = ({ CLicks , Range }) => {


     const current_day = new Date();
    const current_month = current_day.getMonth();
    const current_year = current_day.getFullYear();


   const clicksByWeek = CLicks.reduce((acc, click)=>{
 

    const t = new Date(click.timestamp);

    if(t.getMonth() != current_month || t.getFullYear() != current_year){
      return acc;
    }
    const week_no = Math.floor((t.getDate()-1)/7);
    acc[`week ${week_no}`] = (acc[`week ${week_no}`] || 0) + 1;
    return acc;

    },{})

    const clicksByMonth = CLicks.reduce((acc, click)=>{
      const monthName = new Date(click.timestamp).toLocaleString('default', { month: 'short' }); 
      acc[monthName] = (acc[monthName] || 0) + 1; 
      
      return acc;

    },{})
  const clicksByDay = CLicks.reduce((acc, click) => {
    const day = new Date(click.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    acc[day] = (acc[day] || 0) + 1
    return acc;
  }, {})

    const fetchFunction=React.useMemo(() => {

      switch (Range) {
          case '7 days': return clicksByDay
          case '30 days': return clicksByMonth
          case '1 Year': return clicksByWeek
        }
    }, [CLicks, Range]);


  const labels = Object.keys(fetchFunction);
  const values = Object.values(fetchFunction);

  const data = {
    labels,
    datasets: [
      {
        label: 'Clicks',
        data: values,
        borderColor: '#4338ca',
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#4338ca',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart
          if (!chartArea) return 'rgba(99,102,241,0.1)'
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(67,56,202,0.35)')
          gradient.addColorStop(1, 'rgba(147,197,253,0)')
          return gradient
        },
      },
    ],
  }

  return (

      <div className='flex-1 min-h-[400px]  bg-white rounded-2xl p-4'>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: { bottom: 8 },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1E152A',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { padding: 8 },
              },
              y: {
                beginAtZero: true,
                grid: { color: '#f0f0f0' },
                border: { display: false },
                ticks: { padding: 8 },
              },
            },
            interaction: {
              mode: 'index',
              intersect: false,
            },
          }}
        />
      </div>
  )
}

export default Graph