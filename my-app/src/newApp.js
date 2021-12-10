import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useCallback } from 'react';


function App() {
    const [campaigns, setCampaigns] = useState(null);
    const [bids, setBids] = useState(null);
    const [selected, setSelected] = useState(null);
    const [time, setTime] = useState(null);
    const [endTime, setEndTime] = useState(0);
    const [win, setWin] = useState(0);

    const handleSelect = async (e) => {
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
            setCampaigns(data);
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

        for (let index in data) {
            if (index % 2 === 0) {
                let m = await getBid(data[index]);
                let j = JSON.parse(m);

                if (j.campaign === select) { //todo
                    console.log(j.status);

                    if (j.status === 0) {
                        allData += m;
                    }
                    else if (j.status === 1) {
                        setError(error + 1);
                    }
                    else if (j.status === 2) {
                        setLose(lose + 1);
                    }
                    else {
                        setWin(win + 1);
                    }
                }
            }
        }
        setBids(allData);
    }

    async function getBid(bidId) {
        const response = await fetch("http://localhost:3001/bid/" + bidId);
        const data = await response.json();
        return data;
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                {campaigns && (
                    <select className="campaigns" onChange={handleSelect} >
                        <option key="campaign">Campaign</option>
                        {campaigns.map((campaign, index) => (
                            <option key={index + 1}>{campaign}</option>
                        ))}
                    </select>
                )}
                <p></p>
                <p></p>
                <p>{bids}</p>
                <p>{win}</p>
            </header>
        </div>
    );
}

export default App;