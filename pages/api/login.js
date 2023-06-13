//import withSession from "../../src/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { session } from "../../lib/session";
import { userServices } from "../../src/services/";

export default login;

async function login(req, res) {
	const { email, password } = req.body;
	const { status, response } = await userServices.login({ email, password });

	if (status === 200) {
		if (response.user.userRoll === "commerce_admin" || response.user.userRoll === "commerce_employee") {
			withIronSessionApiRoute(async (req, res) => {
				const user = { isLoggedIn: true, ...response };
				req.session.commerce = user;
				const a = await req.session.save();
				res.status(status).json({
					...response,
				});
			}, session["commerce"])(req, res);
		} else if (response.user.userRoll === "admin" || response.user.userRoll === "sub_admin") {
			withIronSessionApiRoute(async (req, res) => {
				const user = { isLoggedIn: true, ...response };
				req.session.admin = user;
				const a = await req.session.save();
				res.status(status).json({
					...response,
				});
			}, session["admin"])(req, res);
		} else {
			withIronSessionApiRoute(async (req, res) => {
				const user = { isLoggedIn: true, ...response };
				req.session[response.user.userRoll] = user;
				await req.session.save();
				res.status(status).json({
					...response,
				});
			}, session[response.user.userRoll])(req, res);
		}
	} else {
		res.status(status).json({
			...response,
		});
	}
}
