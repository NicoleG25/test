import bigabidLogo from './bigabid-logo.png'
import './App.css';
import { useState, useEffect } from 'react';
import BasicTable, {error, lose, win, resetStats} from './Table'
import BasicList from "./List";


function App() {
  const [campaigns, setCampaigns] = useState(null);
  const [bids, setBids] = useState(null);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(null);
  const [endTime, setEndTime] = useState(0);

  const handleSelect = async (e) => {
    resetStats()
    setSelected(e.target.value);
    if (selected !== "Campaign") {
      setTime(Math.round(new Date().getTime() / 1000));
      setEndTime(Math.round(new Date().getTime() / 1000) + 1);
    }
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
    }
    else if (selected && selected !== "Campaign") {
      const interval = setInterval(() => {
        setEndTime(endTime + 1);
        getBids(selected, time);
      }, 1000);
      return () => {
        clearInterval(interval);
      }
    }
  }, [selected, time, endTime]);

  useEffect(() => {
    if (endTime) {
    }
  }, [endTime]);

  async function getBids(select, startTime) {
    const response = await fetch("http://localhost:3001/list_of_bids?startTime=" + startTime + "&endTime=" + endTime);
    const data = await response.json();
    setBids(data);
  }


  return (
      <div className="App">
        <header className="App-header">
          <img src={bigabidLogo} />
          Bigabid Banker
          {campaigns && (
              <select className="campaigns" onChange={handleSelect} >
                <option key="campaign">Campaign</option>
                {campaigns.map((campaign, index) => (
                    <option key={index + 1}>{campaign}</option>
                ))}
              </select>

            )}
         <br/>
          <div class="flexbox-container">


            <div
                style={{'margin-right': '30vw',
                'margin-left': '5vw'}}
            >
              Pending bids
              <BasicTable bids={bids} selected={selected}/>
            </div>

            <div
                style={{'margin-right': '5vw'}}
            >
              Resolved bids
              <BasicList wins={win} loses={lose} errors={error}>

              </BasicList>
            </div>

          </div>

        </header>
      </div>
  );
}

export default App;