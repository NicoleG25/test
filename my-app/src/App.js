import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import BasicTable from './Table'

function App() {
  const [campaigns, setCampaigns] = useState(null);
  const [bids, setBids] = useState(null);
  const [selected, setSelected] = useState(null);
  const columns = [
    { title: "Bid Id", field: "id" },
    { title: "Bid Time", field: "time" },
    { title: "Price", field: "price" }
  ]

  function getBidInfo(bids) {
    for (let i = 0; i < bids.length; i++) {
      if (i % 2 !== 0) { // all bids are even and timestamps are odd
        let date = convertTime(bids[i]);
        console.log(date)
      }
    }
  }

  function convertTime(timestamp) {
    //let unix_timestamp = 1549312452
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    return new Date(timestamp * 1000); //check its correct
  }
  function testRead() {
    const http = require('http');

    const options = {
      host: 'http://localhost:3001',
      path: '/list_of_bids'
    }
    const request = http.request(options, function (res) {
      let data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        console.log(data);

      });
    });
    request.on('error', function (e) {
      console.log(e.message);
    });
    request.end();
  }

  useEffect(() => {
    getData();


    // we will use async/await to fetch this data
    async function getData() {
      const response = await fetch("http://localhost:3001/list_of_campaigns");
      const data = await response.json();

      setCampaigns(data) ;
    }
  }, []);

  // we will use async/await to fetch this data
  async function getBids() {
    const response = await fetch("http://localhost:3001/list_of_bids");
    const data = await response.json();

    setBids(data) ;
    console.log(data)
    getBidInfo(data);
  }


  const handleSelect=(e)=>{
    setSelected(e.target.value);
    getBids();
  }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Bigabid Banker
          {campaigns && (
              <select className="campaigns" onChange={handleSelect} >
                {campaigns.map((campaign, index) => (
                    <option key={index + 1}>{index + 1}. {campaign}</option>
                ))}
              </select>

            )}
          {/*{convertTime()}*/}
          {testRead()}
          <div  style={{'margin-left': '100px',
          'align-self': 'flex-start',
          'margin-top': '50px'}}>
            Pending bids
            <BasicTable bids={bids}/>
          </div>

          <div  style={{'margin-right': '100px',
            'align-self': 'flex-end',
            'margin-top': '-252px'}}>
            Resolved bids
            <p>Wins</p>
            <p>Loses</p>
            <p>Errors</p>
          </div>

          <p>{ selected }</p>
          <p>{ bids }</p>
        </header>
      </div>
  );
}

export default App;