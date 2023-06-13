import { Box, Modal as MuiModal } from "@mui/material";

export default function Modal({ children, open, onClose, sx }) {
	return (
		<MuiModal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
			<Box
				sx={[
					{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: { xs: 355, md: 400 },
						bgcolor: "white",
						boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.25)",
						borderRadius: "15px",
						p: 4,
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					},
					{ ...sx },
				]}
			>
				{children}
			</Box>
		</MuiModal>
	);
}
