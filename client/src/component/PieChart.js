import { Chart } from "react-google-charts";

const options = {
 
  
  chartArea:{
    height:"90%",
    width:"90%"
  }
};

export const PieChart = ({data,month}) =>{

  return (
    <div className="flex-div">
        <h1>Pie Chart - {month}</h1>
       <Chart
      chartType="PieChart"
      data={data}
      options={options}
    
      width={"80%"}
      height={"300px"}
    />
    </div>
  )




}