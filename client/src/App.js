import './App.css';
import React, {useEffect, useState} from 'react';
import { Table } from './component/Table';
import { getTransactions,getBarchart,getPiechart,getStatistics } from './api/api';
import { BarChart } from './component/BarChart';
import { PieChart } from './component/PieChart';
import { Statistics } from './component/Statistics';

function App() {
  const [month,setMonth] = useState(3)
  const [search,setSearch] = useState("")
  const [page,setPage] = useState(1)
  const [perPage,setPerPage] = useState(10)
  const [data,setData] = useState([])
  const [statistics,setStatistics] = useState([])
  const [barchart,setBarchart] = useState([])
  const [piechart,setPiechart] = useState([])

  const monthName = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }
  

  const fetchData = async () => {
    const resData = await getTransactions(search,page,perPage)
    console.log(resData)
    setData(resData?.transactions)

  }

  function convertBarData(input) {
    
      const data = [
        ["Range", "Count"]
      ];
    
      input.forEach(item => {
        data.push([item.range, item.count]);
      });
    
      return data;
    }

    function convertPieData(input) {
    
      const data = [
        ["Category", "Count"]
      ];
    
      input.forEach(item => {
        data.push([item.category, item.count]);
      });
    
      return data;
    }
    

  const getMonthData = async () => {
    setStatistics(await getStatistics(month))
    const bardata = convertBarData(await getBarchart(month)) 
    setBarchart(bardata)
    const piedata = convertPieData(await getPiechart(month)) 
    setPiechart(piedata)
    console.log(statistics,barchart,piechart)

  }


  const handleNextPage = () => {
    
    setPage(page+1)
   
  }
  const handlePrevPage = () => {
    setPage(page-1)
  
  }
  useEffect(()=>{

   fetchData()
    
  },[page,search,perPage])

  useEffect(()=>{
    
    getMonthData()

  },[month])
  return (
    <div className="App">
      
    <Table search={search} month={month} handleMonthChange={setMonth} handleSearchChange={setSearch} data={data} page={page}  handlePerPage={setPerPage} perPage={perPage} handleNextPage={handleNextPage} handlePreviousPage={handlePrevPage}/>
    
    <Statistics data={statistics} month={monthName[month]} />
    <BarChart data={barchart} month={monthName[month]}/>
    <PieChart data={piechart} month={monthName[month]}/>
    </div>
  );
}

export default App;
