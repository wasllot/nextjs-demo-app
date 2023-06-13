//import withSession from "../../src/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { session } from "../../lib/session";

export default updateUserWallet;

async function updateUserWallet(req, res) {
	const {
		cookie: { user, isLoggedIn, message, token },
	} = req.body;
	withIronSessionApiRoute(async (req, res) => {
		req.session.user = {
			user,
			isLoggedIn,
			message,
			token,
		};
		await req.session.save();
		res.status(200).json({
			message: "ok",
		});
	}, session["user"])(req, res);
}
