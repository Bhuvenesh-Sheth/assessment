export const Table = ({search,handleMonthChange,handleSearchChange,month,data,handleNextPage,handlePerPage,handlePreviousPage,page,perPage}) => {


  const itemsPerPageOptions = [5, 10];
  
  const months = [
    { name: 'January', index: 1 },
    { name: 'February', index: 2 },
    { name: 'March', index: 3 },
    { name: 'April', index: 4 },
    { name: 'May', index: 5 },
    { name: 'June', index: 6 },
    { name: 'July', index: 7 },
    { name: 'August', index: 8 },
    { name: 'September', index: 9 },
    { name: 'October', index: 10 },
    { name: 'November', index: 11 },
    { name: 'December', index: 12 },
  ];
  

  return (
    <div class="container">
        <div class="title">
            <div>Transaction</div>
            <div>Dashboard</div>
        </div>
        <div class="button-container">
    
      <input
        type="text"
        placeholder="Search transaction"
        value={search}
        onChange={(e)=>handleSearchChange(e.target.value)}
        className="button"
      />
   
      <select
        value={month}
        onChange={(e)=>handleMonthChange(e.target.value)}
        className="button"
      >
        <option value="">Select Month </option>
        {months.map((month) => (
          <option key={month.index} value={month.index}>
            {month.name}
          </option>
        ))}
      </select>
 
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                   {data?.map((i)=> <tr>
                        <td>{i.id}</td>
                        <td>{i.title}</td>
                        <td>{i.description.slice(0,50)}...</td>
                        <td>{i.price} $</td>
                        <td>{i.category}</td>
                        <td>{i.sold?"Sold":"Available"}</td>
                        <td><img alt="img" className="responsive-image" src={i.image}></img></td>
                    </tr>)}
                  
                </tbody>
            </table>
        </div>
        <div class="pagination">
       
        <span>Page No: {page}</span>
        <div>
        <button className="button" disabled={page==1} onClick={handlePreviousPage}>
          Previous
        </button>
        <button className="button" disabled={page==6}  onClick={handleNextPage}>
          Next
        </button>
        </div>
        <div>
        <span>Per Page: </span>
        <select
          value={perPage}
          onChange={(e)=>handlePerPage(e.target.value)}
          className="button"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        </div>
            </div>
    </div>
  )
}