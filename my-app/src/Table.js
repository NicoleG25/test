import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';


function createData(id, time, price) {
    return { id, time, price };
}
export let win = 0;
export let lose = 0;
export let error = 0

function setWins(value) {
    win = win + value;
}
function setLoses(value) {
    lose = lose + value;
}
function setErrors(value) {
    error = error + value;
}

function convertTime(timestamp) {
    return new Date(timestamp * 1000); //check its correct
}

export default function BasicTable({bids, selected, campaign}) {
    const [table, setTable] = useState([]);
    // const [win, setWin] = useState(0);
    // const [error, setError] = useState(0);
    // const [lose, setLose] = useState(0);

    async function getBidInfo(bids, campaign) {
        win = 0;
        lose = 0;
        error = 0;
        const result = [];
        if (bids) {
            for (let i = 0; i < bids.length; i++) {
                if (i % 2 !== 0) { // all bids are even and timestamps are odd
                    let date = convertTime(bids[i]);
                    let bidId = bids[i - 1];
                    let bidInfo = await getBid(bidId);
                    let bidInfoJson = JSON.parse(bidInfo);
                    if (bidInfoJson.campaign === campaign) {
                        if (bidInfoJson.status === 0) {
                            result.push({
                                id: bidId,
                                time: date,
                                price: bidInfoJson.price,
                                campaign: bidInfoJson.campaign,
                                status: bidInfoJson.status
                            });
                        }
                        else if (bidInfoJson.status === 1) {
                            // setError(error + 1);
                            setErrors(1);
                        }
                        else if (bidInfoJson.status === 2) {
                            // setLose(lose + 1);
                            setLoses(1);
                        }
                        else {
                            // setWin(win + 1);
                            setWins(1);
                        }
                    }

                }
            }
        }
        return result;

    }

    async function getBid(bidId) {
        const response = await fetch("http://localhost:3001/bid/" + bidId);
        const data = await response.json();
        return data;
    }

    useEffect(async () => {
        if (selected) {
            //setTable(await getBidInfo(bids));
            console.log(bids);
            //const j = await getBidInfo(bids);
            setTable(await getBidInfo(bids, selected));
            console.log(table);
        }
    }, [bids]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Bid Id</TableCell>
                        <TableCell align="right">Bid Time</TableCell>
                        <TableCell align="right">Price&nbsp;($)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { table.map(row => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.time.toString()}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
