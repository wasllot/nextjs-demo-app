import { withIronSessionApiRoute } from "iron-session/next";
import { session } from "../../lib/session";

export default destruir;

async function destruir(req, res) {
	const { role } = req.query;
	return withIronSessionApiRoute(logoutRoute, session[role])(req, res);
}

async function logoutRoute(req, res) {
	req.session.destroy();
	res.json({ isLoggedIn: false });
}
