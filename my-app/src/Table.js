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

const rows = [
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Eclair', 262, 16.0),
];

async function getBidInfo(bids, campaign) {
    const result = [];
    if (bids) {
        for (let i = 0; i < bids.length; i++) {
            if (i % 2 !== 0) { // all bids are even and timestamps are odd
                let date = convertTime(bids[i]);
                let bidId = bids[i - 1];
                let bidInfo = await getBid(bidId);
                let bidInfoJson = JSON.parse(bidInfo);
                if (bidInfoJson.campaign === campaign) {
                    result.push({
                        id: bidId,
                        time: date,
                        price: bidInfoJson.price,
                        campaign: bidInfoJson.campaign,
                        status: bidInfoJson.status
                    });
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

function convertTime(timestamp) {
    //let unix_timestamp = 1549312452
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    return new Date(timestamp * 1000); //check its correct
}

export default function BasicTable({bids, selected, campaign}) {
    const [table, setTable] = useState([]);

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
        // <div>{table.map(t => <div>{t.price}</div>)}</div>
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
