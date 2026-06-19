import React from 'react'
import {Line} from 'react-chartjs-2'
import { Chart,CategoryScale,LinearScale,PointElement,LineElement,Filler,Tooltip } from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);


const Graph = ({CLicks}) => {

    const clicksByDay = CLicks.reduce((acc,click)=>{
        const day = new Date(click.timestamp).toLocaleDateString('en-US',{weekday:'short'});

        acc[day] = (acc[day] || 0) + 1;
        return acc;
    },{});

        const data = {
        labels: Object.keys(clicksByDay),
        datasets: [{
            label: 'Clicks',
            data: Object.values(clicksByDay),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.6,
                    options: {
          scales: {
            x: {
              ticks: {
                font: {
                  size: 14   // default is usually 12
                }
              }
            },
            y: {
              ticks: {
                font: {
                  size: 14
                }
              }
            }
          }
        }
        }],

    };
  return (
    <div className='h-full w-full flex flex-col p-4 md:gap-5 bg-[#d9d9d9] rounded-2xl  md:p-5'>
       <h2 className='text-2xl font-primary tracking-wide '>Clicks Over Time</h2>

      <Line className='bg-white md:p-3 font-semibold rounded-2xl shadow-xl' data={data} />

    </div>
  )
}

export default Graph
