import bigabidLogo from './bigabid-logo.png'
import './App.css';
import { useState, useEffect } from 'react';
import BasicTable, {error, lose, win, resetStats} from './Table'
import BasicList from "./List";
import io from "socket.io-client";


function App() {
  const [campaigns, setCampaigns] = useState(null);
  const [bids, setBids] = useState(null);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(null);
  const [endTime, setEndTime] = useState(0);
  const [socket, setSocket] = useState(null);



  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3001`);
    setSocket(newSocket);
    newSocket.on("getCampaigns", async (data) => {
      setCampaigns(data);
    });
    return () => newSocket.close();
  }, [setSocket]);


  const handleSelect = async (e) => {
    resetStats()
    setSelected(e.target.value);

    if (selected !== "Campaign") {
      setTime(Math.round(new Date().getTime() / 1000));
      setEndTime(Math.round(new Date().getTime() / 1000) + 1);
    }
  }


  useEffect(() => {
    if (selected) {
      socket.emit("campaignSelected", { 'campaign': selected, 'timeSelected': time });
      socket.once("getBids", async (data) => setBids(data));
      const interval = setInterval(async () => setEndTime(endTime + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [selected,  endTime]);


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