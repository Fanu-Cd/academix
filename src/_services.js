const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const matchValues = (value1, value2) => {
  return value1 === value2 ? true : false;
};

const fetcher = (endpoint, method = "get", body) => {
  const apiUrl = "http://localhost:3001";
  if (method) {
    return fetch(`${apiUrl}/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => res);
  } else {
    return fetch(`${apiUrl}/${endpoint}`);
  }
};

const renderStatus = (status) => {
  if (status == "not-approved" || status == "banned" || status == "declined") {
    return (
      <small className="bg-danger p-2 text-white rounded text-center">
        {status}
      </small>
    );
  } else if (status == "active") {
    return (
      <small className="bg-success p-2 text-white rounded text-center">
        {status}
      </small>
    );
  }
};

const arrayFilter = (data, field, value) => {
  return data.filter((dt) => dt[field] == value);
};

export { validateEmail, matchValues, fetcher, renderStatus, arrayFilter };
