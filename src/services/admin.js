const base = process.env.NEXT_PUBLIC_API_URL;

const getOrders = async ({ token, limit, page, filter, query = "" }) => {
  const queryParams = filter==="in_process"||filter==="completed"?`&nfcQrStatus=${filter}`:`&status=${filter}`
  const request = await fetch(
    `${base}/orders?limit=${limit}&page=${page}&query=${query}${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getTransactions = async ({ token, limit, page, query = "" }) => {
  const request = await fetch(
    `${base}/transactions/users?limit=${limit}&page=${page}&query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getUserTransactions = async ({ token, limit, page, query = "", userId }) => {
  const request = await fetch(
    `${base}/transactions/user/${userId}?limit=${limit}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getCommerceTransactions = async ({ token, limit, page, query = "", commerceId }) => {
  const request = await fetch(
    `${base}/business/transactions/${commerceId}?limit=${limit}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getUsers = async ({ token, limit, page, query = "" }) => {
  const request = await fetch(
    `${base}/users/getusers?limit=${limit}&page=${page}&query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getCommerces = async ({ token, limit, page }) => {
  const request = await fetch(`${base}/business?limit=${limit}&page=${page}`, {
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

const getAdmins = async ({ token }) => {
  const request = await fetch(`${base}/users/administrators`, {
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

const findOrders = async ({ token, limit, page, search }) => {
  const request = await fetch(
    `${base}/orders/find?limit=${limit}&page=${page}&query=${search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const totalOrders = async ({ token, start, end }) => {
  const request = await fetch(
    `${base}/orders/total?start=${start}&end=${end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    }
  );

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const approveOrder = async ({ token, orderId, walletCode }) => {
  const request = await fetch(`${base}/orders/approved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, walletCode }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const rejectOrder = async ({ token, orderId }) => {
  const request = await fetch(`${base}/orders/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};
const nfcComplete = async ({ token, orderId }) => {
  const request = await fetch(`${base}/orders/nfccomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const getDollarPrice = async () => {
  const request = await fetch(`${base}/dolarprice`, {
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

const putDollarPrice = async ({ token, price }) => {
  const request = await fetch(`${base}/dolarprice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ price }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const addCommerce = async ({ token, data }) => {
  const request = await fetch(`${base}/business/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const addAdministrator = async ({ token, data }) => {
  const request = await fetch(`${base}/users/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const addUserWithCredits = async ({ token, data }) => {
  const request = await fetch(`${base}/users/addwithcredits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const addApprovedOrder = async ({ token, data }) => {
  const request = await fetch(`${base}/orders/topupbalance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};

const exportOrder = async () => {
  const request = await fetch(`${base}/orders/export`, {
    method: "GET"
  });

  const response = await request.blob();

  return {
    status: request.status,
    response
  };
};
const exportTransactions = async () => {
  const request = await fetch(`${base}/transactions/export`, {
    method: "GET"
  });

  const response = await request.blob();

  return {
    status: request.status,
    response
  };
};
const blockCard = async ({token, data}) => {
  const request = await fetch(`${base}/users/wallet/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};
const activateUser = async ({token, data}) => {
  const request = await fetch(`${base}/users/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const response = await request.json();

  return {
    status: request.status,
    response,
  };
};
const adminServices = Object.freeze({
  getOrders,
  findOrders,
  approveOrder,
  rejectOrder,
  getTransactions,
  getCommerces,
  getUsers,
  putDollarPrice,
  getDollarPrice,
  addCommerce,
  addUserWithCredits,
  addApprovedOrder,
  nfcComplete,
  exportOrder,
  exportTransactions,
  getUserTransactions,
  getCommerceTransactions,
  addAdministrator,
  getAdmins,
  totalOrders,
  blockCard,
  activateUser
});

export default adminServices;
