import React from 'react'
import {Bar} from 'react-chartjs-2'
import { Chart,CategoryScale,LinearScale,BarElement,Legend,Tooltip } from 'chart.js'

Chart.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);


const Graph = ({CLicks}) => {

    const clicksByDay = CLicks.reduce((acc,click)=>{
        const day = new Date(click.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        acc[day] = (acc[day] || 0) + 1;
        return acc;
    },{});

        const data = {
        labels: Object.keys(clicksByDay),
        datasets: [{
            label: 'Clicks',
            data: Object.values(clicksByDay),
            borderColor: '#1E152A',
            backgroundColor: '#595959',
            fill: true,
            tension: 0.6,
            borderRadius:4,
                    
        }],

    };
  return (
<div className='h-full w-full flex flex-col p-4 md:gap-5 bg-[#d9d9d9] rounded-2xl  md:p-5'>
  <h2 className='text-2xl font-primary tracking-wide'>Clicks Over Time</h2>

  <div className='flex-1 min-h-[300px] bg-white rounded-2xl shadow-xl p-4'>
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { bottom: 8 }
        },
        scales: {
          x: {
            ticks: { padding: 8 }
          }
        }

      }}
      
    />
  </div>
</div>
  )
}

export default Graph
