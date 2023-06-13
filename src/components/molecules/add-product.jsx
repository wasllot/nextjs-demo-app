import { Grid, Typography, IconButton, Tooltip } from "@mui/material";
import { TextField } from "../../../src/components/molecules";
import { Button } from "../../../src/components/atoms";
import DeleteIcon from "@mui/icons-material/Delete";
import { EnableIcon, DisableIcon } from "../icons";
export default function AddProduct({ onClick, register, index, isActive, errors, display, _id, img, onAddImg }) {
	return (
		<Grid
			container
			item
			xs={11}
			md={10}
			spacing={2}
			alignItems="center"
			sx={{
				boxShadow: "0px 4px 10px rgba(86, 86, 86, 0.25)",
				borderRadius: "10px",
				padding: "24px 32px 32px",
				width: "100%",
				margin: "20px 0",
				position: "relative",
				display: display ? "flex" : "none",
			}}
		>
			<Grid item xs={12} md={3}>
				<TextField
					placeholder="NOMBRE*"
					sx={{ bgcolor: "white", color: "#595959" }}
					inputRef={register(`products.${index}.name`, { required: "No olvides ingresar el nombre!" })}
					error={errors.products && errors.products[index]?.name ? true : false}
					helperText={errors.products && errors.products[index]?.name?.message}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					placeholder="DESCRIPCIÓN"
					sx={{ bgcolor: "white", color: "#595959" }}
					inputRef={register(`products.${index}.description`, { required: "No olvides ingresar una descripción !" })}
					error={errors.products && errors.products[index]?.description ? true : false}
					helperText={errors.products && errors.products[index]?.description?.message}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					type="number"
					placeholder="PRECIO"
					sx={{ bgcolor: "white", color: "#595959" }}
					inputRef={register(`products.${index}.price`, { required: "No olvides ingresar el precio!" })}
					error={errors.products && errors.products[index]?.price ? true : false}
					helperText={errors.products && errors.products[index]?.price?.message}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				{
					<Button
						fullWidth
						component="label"
						color="primary"
						variant="outlined"
						disabled={_id ? false : true}
						sx={{
							height: "55.98px",
							backgroundImage: `url('${img}')`,
							backgroundSize: "cover",
							height: img ? 100 : "unset",
							color: img ? "#000" : "#FFF",
						}}
					>
						{img ? "" : "Agregar imagen"}
						<input type="file" accept="image/*" hidden onChange={(e) => onAddImg(e)} />
					</Button>
				}
			</Grid>
			<Tooltip title={"Eliminar"} TransitionProps={{ style: { fontFamily: "Lato, sans-serif" } }}>
				<IconButton
					sx={[
						(theme) => ({
							position: "absolute",
							width: "40px",
							height: "40px",
							right: "-2%",
							top: "-6%",
							backgroundColor: theme.palette.primary.main,
							color: "#FFF",
							"&:hover": {
								backgroundColor: theme.palette.primary.main,
							},
						}),
					]}
					onClick={() => onClick(!isActive)}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</Grid>
	);
}
