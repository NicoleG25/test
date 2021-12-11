import {List, ListItem, ListItemText} from "@mui/material";


export default function BasicList({wins, loses, errors}) {
return (
    <List sx={{width: '100%', maxWidth: 360}}>
        <ListItem key={1}>
            <ListItemText primary={`Wins ${wins}`}/>
        </ListItem>

        <ListItem key={2}>
            <ListItemText primary={`Loses ${loses}`}/>
        </ListItem>

        <ListItem key={3}>
            <ListItemText primary={`Errors ${errors}`}/>
        </ListItem>

    </List>
);
}