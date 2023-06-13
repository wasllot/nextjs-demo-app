const user = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: "user",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

const commerce = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: "commerce",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

const admin = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: "admin",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export const session = {
	admin,
	commerce,
	user,
};
