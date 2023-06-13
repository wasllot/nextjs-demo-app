const base = process.env.NEXT_PUBLIC_API_URL;
//const base = "http://192.168.86.37:8000/api/v1";

const register = async ({ firstName, lastName, phone, document, email, password, pin }) => {
	const request = await fetch(`${base}/users/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			firstName,
			lastName,
			phone,
			document,
			email,
			password,
			pin,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const validateAccount = async ({ token }) => {
	const request = await fetch(`${base}/users/validateaccount`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			token,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const resetPassword = async ({ email }) => {
	const request = await fetch(`${base}/users/resetpassword`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const updatePassword = async ({ token, password }) => {
	const request = await fetch(`${base}/users/updatepassword`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, password }),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const getBalance = async ({ id }) => {
	const request = await fetch(`${base}/users/balance/${id}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const getDolarPrice = async () => {
	const request = await fetch(`${base}/dolarprice`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const login = async ({ email, password }) => {
	const request = await fetch(`${base}/users/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const logout = async ({ role }) => {
	const request = await fetch(`/api/logout?role=${role}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const response = await request.json();
	return {
		status: request.status,
		response,
	};
};

const addOrder = async ({ token, credits, payment }) => {
	const request = await fetch(`${base}/orders/add`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ credits: credits, payment }),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const addOrderUbii = async ({ token, credits, payment }) => {
	const request = await fetch(`${base}/orders/ubii`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ credits: credits, payment }),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const getTransactions = async ({ token, page, limit, query }) => {
	const request = await fetch(`${base}/transactions?limit=${limit}&page=${page}&query=${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const updateWallet = async ({ cookie }) => {
	const request = await fetch("/api/update-user-wallet", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cookie,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const updateUserStatus = async ({ _id, status, token }) => {
	const request = await fetch(`${base}/users/status`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			_id,
			status,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const resendEmail = async ({ email }) => {
	const request = await fetch(`${base}/users/resendemail`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const getBusiness = async () => {
	const request = await fetch(`${base}/business`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

export const getUserMetrics = async ({start, end}) => {
	const req = await fetch(`${base}/users/metrics?start=${start}&end=${end}`)

	const res = await req.json()

	return {
		status: req.status,
		response: res
	}
} 

const userServices = Object.freeze({
	register,
	validateAccount,
	getBalance,
	resetPassword,
	updatePassword,
	login,
	logout,
	addOrder,
	getTransactions,
	updateWallet,
	getDolarPrice,
	updateUserStatus,
	resendEmail,
	getBusiness,
	addOrderUbii
});

export default userServices;
