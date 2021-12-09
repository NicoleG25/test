import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import BasicTable from './Table'

function App() {
  const [campaigns, setCampaigns] = useState(null);
  const [bids, setBids] = useState(null);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(null);
  const [endTime, setEndTime] = useState(0);
  const [win, setWin] = useState(0);
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

  const handleSelect = async (e) => {
    setSelected(e.target.value);
    if (selected !== "Campaign") {
      setTime(Math.round(new Date().getTime() / 1000));
      setEndTime(Math.round(new Date().getTime() / 1000) + 1);
    }
  }

  function convertTime(timestamp) {
    //let unix_timestamp = 1549312452
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    return new Date(timestamp * 1000); //check its correct
  }

  useEffect(() => {
    getData();
    async function getData() {
      const response = await fetch("http://localhost:3001/list_of_campaigns");
      const data = await response.json();
      setCampaigns(data) ;
    }
  }, []);

  useEffect(() => {
    if (selected && selected === "Campaign") {
      setBids("");
      setWin(0);
    }
    else if (selected && selected !== "Campaign") {
      //setBids("");
      console.log(selected, time, endTime);
      const interval = setInterval(() => {
        setEndTime(endTime + 1);
        getBids(selected, time);
      }, 1000);
      return () => {
        console.log("cleared");
        clearInterval(interval);
      }
    }
  }, [selected, time, endTime]);

  useEffect(() => {
    if (endTime) {
      //
    }
  }, [endTime]);

  async function getBids(select, startTime) {
    let allData = "";
    const response = await fetch("http://localhost:3001/list_of_bids?startTime=" + startTime + "&endTime=" + endTime);
    const data = await response.json();

    // for (let index in data) {
    //   if (index % 2 === 0) {
    //     let m = await getBid(data[index]);
    //     let j = JSON.parse(m);
    //
    //     if (j.campaign === select) {
    //       console.log(j.status);
    //
    //       if (j.status === 0) {
    //         allData += m;
    //       }
    //       if (j.status === 1) {
    //         setWin(win + 1);
    //       }
    //     }
    //   }
    // }
    setBids(data);
  }


  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Bigabid Banker
          {campaigns && (
              <select className="campaigns" onChange={handleSelect} >
                <option key="campaign">Campaign</option>
                {campaigns.map((campaign, index) => (
                    <option key={index + 1}>{campaign}</option>
                ))}
              </select>

            )}
          <div  style={{'margin-left': '100px',
          'align-self': 'flex-start',
          'margin-top': '50px'}}>
            Pending bids
            <BasicTable bids={bids} selected={selected}/>
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
          <p></p>
        </header>
      </div>
  );
}

export default App;