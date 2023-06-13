import { Box, List, ListItem, ListItemText } from "@mui/material";

export default function NavList() {
    return(
        <Box
        sx={{width: "250px"}
        }>
            <nav>
                <List>
                    <ListItem>
                        <ListItemText primary= "Perfil"/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary= "Cerrar sesión"/>
                    </ListItem>
                </List>
            </nav>
        </Box>

    );
  
}
