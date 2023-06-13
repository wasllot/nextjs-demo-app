const base = process.env.NEXT_PUBLIC_API_URL;
//const base = "http://192.168.86.250:8000/api/v1";

const getProducts = async ({ _id, isActive }) => {
	const request = await fetch(`${base}/products/${_id}${isActive ? "?isActive=true" : ""}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const addRefund = async ({ transactionId, pin, token }) => {
	const request = await fetch(`${base}/orders/refund`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},

		body: JSON.stringify({
			transactionId,
			pin,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const addProducts = async ({ products, token }) => {
	const request = await fetch(`${base}/products`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			products,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const purchase = async ({ userId, products, pin, token }) => {
	const request = await fetch(`${base}/orders/purchase`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			userId,
			products,
			pin,
		}),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

export const getAdminsTotalPaymentMethod = async ({start, end}) => {
	const req = await fetch(`${base}/orders/adminstotalpaymentmethod?start=${start}&end=${end}`)

	const res = await req.json()

	return {
		status: req.status,
		response: res
	}
}

export const getTotalGeneratePaymentMethod = async ({start, end}) => {
	const req = await fetch(`${base}/orders/totalgeneratepaymentmethod?start=${start}&end=${end}`)

	const res = await req.json()

	return {
		status: req.status,
		response: res
	}
}

export const getAdminTotalRegisterAndTopUpBalance = async ({start, end}) => {
	const req = await fetch(`${base}/orders/adminstotalregisterandtopupbalance?start=${start}&end=${end}`)

	const res = await req.json()

	return {
		status: req.status,
		response: res
	}
}

const addEmployee = async ({ email, password, firstName, lastName, token, userName }) => {
	const request = await fetch(`${base}/business/addemployee`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			firstName,
			lastName,
			userName: userName,
			phone: "xxx",
			document: "xxx",
			pin: "xxx",
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

const getEmployees = async ({ token }) => {
	const request = await fetch(`${base}/business/employess`, {
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

const getTransactions = async ({ token, page, limit, query = "" }) => {
	const request = await fetch(`${base}/business/transactions?page=${page}&limit=${limit}&query=${query}`, {
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

const getCommercBalance = async ({ token }) => {
	const request = await fetch(`${base}/business/balance`, {
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

const updateEmployeeStatus = async ({ _id, status, token }) => {
	const request = await fetch(`${base}/business/activateemployee`, {
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

const addImage = async ({ _id, formData, token }) => {
	const request = await fetch(`${base}/products/${_id}/addimg`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const removeProduct = async ({ _id, isActive, token }) => {
	const request = await fetch(`${base}/products/${_id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isActive: isActive }),
	});

	const response = await request.json();

	return {
		status: request.status,
		response,
	};
};

const commerceServices = Object.freeze({
	getProducts,
	addProducts,
	purchase,
	addEmployee,
	getEmployees,
	getTransactions,
	addRefund,
	updateEmployeeStatus,
	addImage,
	removeProduct,
	getCommercBalance
});

export default commerceServices;
