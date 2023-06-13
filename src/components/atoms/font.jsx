import { Typography } from "@mui/material";

const FAMILIES = {
  raleway: "Raleway",
  brightsight: "BrightSight",
  brother: "Brother",
};

export default function Font({ children, family, sx, ...rest }) {
  return (
    <Typography
      sx={{ ...sx, fontFamily: `${FAMILIES[family]}, sans-serif` }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
