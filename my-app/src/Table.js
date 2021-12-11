import * as React from 'react';
import {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
    return new Date(timestamp * 1000);
}

export function resetStats() {
    win = 0;
    error = 0;
    lose = 0;
}

export default function BasicTable({bids, selected}) {
    const [table, setTable] = useState([]);

    async function getBidInfo(bids) {
        const result = [];
        console.log(bids[0]);
        setWins(0);
        setLoses(0);
        setErrors(0);
        bids.forEach(bid => {
            if (bid.status === 0) {
                        result.push({
                            id: bid.id,
                            time: new Date(bid.date * 1000),
                            price: bid.price,
                            campaign: bid.campaign,
                            status: bid.status
                        });
                    }
                    else if (bid.status === 1) {
                        setErrors(1);
                    }
                    else if (bid.status === 2) {
                        setLoses(1);
                    }
                    else {
                        setWins(1);
                    }

        })
        return result;

    }

    useEffect(async () => {
        if (selected) {
            setTable(await getBidInfo(bids, selected));
        }
    }, [bids]);

    return (
        <TableContainer component={Paper} style={{maxHeight: '40vh'}}>
            <Table stickyHeader sx={{ minWidth: 300, overflow: 'auto' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Bid Id</TableCell>
                        <TableCell align="center">Bid Time</TableCell>
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
                            <TableCell align="right">{row.time.toLocaleString()}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
