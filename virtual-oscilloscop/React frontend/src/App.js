
import './App.css';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
} from 'chart.js';

import uniLogo from './images/University_of_Kalyani_Logo.png'
import detsLogo from './images/dets logo (1).png'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function App() {
  const [dataArray, setDataArray] = useState([]);

  const jsonArray = [];
  for (let i = 0; i < 12; i++) {
    const value = -(i * 0.5);
    jsonArray.push(value);
}

// Reverse the array
jsonArray.reverse();

// Convert to JSON format
const lables = JSON.stringify(jsonArray);


  useEffect(() => {
    // Create a new WebSocket connection
    const newSocket = new WebSocket('ws://192.168.238.157:81');

    // Define WebSocket event listeners
    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (message) => {
      // When a message is received, update the messages state
      console.log(message)
    setDataArray((prev)=>{
      if(prev.length<50){
        return [...prev, message.data]
      }
      else{
        return [...prev.shift(), message.data]
      }
    })
    };


    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    newSocket.onerror = (error) => {
      console.log('WebSocket Error: ', error);
    };    

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="App">
      <img src={uniLogo} alt='' id='uni-logo'></img>
      <img src={detsLogo} alt='' id='dets-logo'></img>
      <h1>Virtual Oscilloscope:</h1>
      <Line
        className='graph'
        datasetIdKey='id'
        options={{
          scales: {
            x: {
              grid: {
                color: '#2d323b' ,
              },
              ticks:{
                color: 'lightgray'
              }
            },
            y: {
              grid: {
                color: '#2d323b',
              },
              ticks:{
                color: 'lightgray'
              }
            }
          }
        }}
        data={{
          labels: lables,
          datasets: [
            {
              id: 1,
              label: 'Signal Graph',
              data: dataArray,
              borderColor:'lightblue'
            }
          ],
        }}
      />
    </div>
  );
}

export default App;
