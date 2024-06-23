import { Chart } from "react-google-charts";

const options = {
 
  
  chartArea:{
    height:"90%",
    width:"90%"
  }
};

export const BarChart = ({data,month}) =>{

  return (
    <div className="flex-div ">
      <h1>Bar Chart - {month}</h1>
     <Chart
        chartType="Bar"
        data={data}
        options={options}
        width="90%"
        height="300px"
      
        
       
      />
    </div>
  )




}