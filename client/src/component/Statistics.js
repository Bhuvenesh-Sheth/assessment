export const Statistics = ({data,month}) =>{


  return (
 
    <div className="flex-div">
        <h1>Statistics - {month}</h1>
    <div className=" circlebox">
    <div className="statistic-div">
      <h3>Total sale </h3>
      <h3>{data?.totalSaleAmount}</h3>
    
    </div>
     <div className="statistic-div">
      <h3>Total sold item </h3>
    <h3>{data?.totalSoldItems}</h3>
    </div>
    <div className="statistic-div"><h3>Total not sold item </h3>
    <h3>{data?.totalNotSoldItems}</h3></div>
    </div>
    </div>
  )




}