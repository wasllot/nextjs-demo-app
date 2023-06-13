import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { useForm, useFieldArray } from "react-hook-form";
import { Grid, Typography, styled, Box, Toolbar } from "@mui/material";
import { session } from "../../../lib/session";
import { TextField, AddProduct, Layout } from "../../../src/components/molecules";
import { Button, Modal, Spinner } from "../../../src/components/atoms";
import { CheckIcon, DangerIcon } from "../../../src/components/icons";
import { commerceServices } from "../../../src/services";
import AddProductSvg from "../../../public/add-product.svg";
import Image from "next/image";
import { useModal } from "../../../src/hooks";

export default function Menu({ user }) {
	const [isLoading, setIsLoading] = useState(false);
	const [query, setQuery] = useState("");
	const { isOpen, error, message, setIsOpen, setError, setMessage } = useModal();
	const [reset, setReset] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		// defaultValues: {}; you can populate the fields by this attribute
	});
	const { fields, append, replace, update, remove } = useFieldArray({
		control,
		name: "products",
	});
	const [products, setProducts] = useState([])

	useEffect(()=>{
		setProducts(fields)
	},[fields])

	const onSubmit = async (data, notSubmit = false) => {
		let { products } = data;
		products = products.map((product) => {
			return {
				description: product.description,
				isActive: product.isActive,
				name: product.name,
				price: product.price,
				_id: product._id,
				nfcSystemId: product.nfcSystemId
			};
		});
		console.log(products)
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.addProducts({ products, token: user.token });
			setIsLoading(false);
			if (status === 200) {
				setIsOpen(notSubmit===true? false : true);
				setMessage("Productos agregados exitosamente.");
				remove();
				await add();
			}
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	async function add() {
		setIsLoading(true);
		const { status, response } = await commerceServices.getProducts({ _id: user.commerce._id });
		setIsLoading(false);
		response.forEach((product) => {
			if (product.isActive) {
				append({
					_id: product._id,
					name: product.name,
					description: product.description,
					price: product.price,
					isActive: product.isActive,
					img: product.img_url,
					nfcSystemId: product.nfcSystemId
				});
			}
		});
	}

	useEffect(() => {
		add();
	}, [append, replace]);

	const filterList = (value) => {
		setQuery(value);
	};

	const handleChangeImage = async ({ _id, value }) => {
		let formData = new FormData();
		formData.append("productImg", value);
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.addImage({ _id, formData, token: user.token });
			setIsLoading(false);
			if (status === 200) {
				setIsOpen(true);
				setMessage("Imagen agregada exitosamente.");
				remove();
				await add();
			}
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	const removeProduct = async ({ _id, index }) => {
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.removeProduct({ _id, isActive: false, token: user.token });
			if (status === 200) {
				remove(index);
				setError(false);
				setMessage("Producto eliminado.");
			} else if (status === 400) {
				if (response.error) {
					setError(true);
					setMessage(response.error.message);
				}
			}
			setIsOpen(true);
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	return (
		<Grid container sx={{ backgroundColor: "#FFF", position: "relative" }} justifyContent="center">
			<Spinner loading={isLoading} />

			<Grid component="main" sx={{ minHeight: "calc(100vh - 205px)" }}>
				<Toolbar />

				<Grid container justifyContent={"center"} alignItems="center">
					<Grid item xs={12} md={12}>
						<Typography align="center" sx={{ color: "#0E1727", fontSize: "2.5rem" }}>
							Items
						</Typography>
					</Grid>
					<Grid item xs={11} md={11} container justifyContent="center">
						<Grid item xs={6} md={4} container sx={{ justifyContent: { xs: "flex-start", md: "center" } }} alignItems={"center"}>
							<Typography
								sx={{ color: "#000000", fontFamily: "Lato, sans-serif", fontSize: { xs: "1.5rem", md: "2.25rem" }, fontWeight: "900" }}
								align="center"
							>
								{user.commerce.name.toUpperCase()}
							</Typography>
						</Grid>
						<Grid item xs={6} md={4} container sx={{ justifyContent: { xs: "flex-end", md: "center" } }} alignItems={"center"}>
							<Box
								sx={{
									width: 100,
									height: 100,
									boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
									borderRadius: "50%",
									backgroundImage: `url('${user.commerce.img_url}')`,
									backgroundSize: user.commerce.name === "El Toque" ? "50%" : "80%",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
							></Box>
						</Grid>
						<Grid item xs={10} md={4} container justifyContent={"center"} alignItems={"center"}>
							<TextField
								onChange={(e) => filterList(e.target.value)}
								placeholder="¿Qué estas buscando?"
								sx={{ bgcolor: "#FFF", color: "#000", width: { md: "80%", xs: "100%" } }}
							/>
						</Grid>
					</Grid>
					<Grid container item xs={11} md={11} justifyContent="center" component={"form"} onSubmit={handleSubmit(onSubmit)}>
						{products.map((item, index) => (
							<AddProduct
								onAddImg={(e) => handleChangeImage({ _id: item._id, value: e.target.files[0] })}
								isActive={item.isActive}
								errors={errors}
								key={index}
								_id={item._id}
								img={item.img}
								display={
									query === "" ||
									item.name.toLowerCase().includes(query.toLowerCase()) ||
									item.description.toLowerCase().includes(query.toLowerCase())
								}
								register={register}
								index={index}
								onClick={(isActive) => removeProduct({ _id: item._id, index })}
							/>
						))}

						<Grid item xs={12} md={10} container justifyContent="center" sx={{ margin: "20px 0" }}>
							<StyledImage
								onClick={() => {append({ name: "", description: "", price: "", _id: null, isActive: true}); onSubmit({products: [...products, { name: " ", description: " ", price: "1", _id: null, isActive: true}]}, true)}}
								src={AddProductSvg}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Button type="submit" fullWidth>
								GUARDAR CAMBIOS
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Modal sx={{ padding: 2 }} open={isOpen} onClose={() => setIsOpen(false)}>
				{error ? <DangerIcon /> : <CheckIcon />}
				<Typography
					sx={{
						fontStyle: "normal",
						fontWeight: "700",
						fontSize: "1.5rem",
						textAlign: "center",
						color: "#0E1727",
						margin: "20px",
					}}
				>
					{message}
				</Typography>
				<Button fullWidth onClick={() => setIsOpen(false)}>
					Continuar
				</Button>
			</Modal>
		</Grid>
	);
}

const StyledImage = styled(Image)(() => ({
	cursor: "pointer",
}));

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
	const cookie = req.session.commerce;
	if (!cookie) {
		return {
			redirect: {
				destination: "/commerce",
				permanent: false,
			},
		};
	}

	const { user, commerce, token, isLoggedIn } = cookie;

	return {
		props: {
			user: {
				...user,
				commerce,
				token,
				isLoggedIn,
			},
		},
	};
}, session.commerce);

Menu.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
