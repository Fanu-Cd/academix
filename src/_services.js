import API_URL from "./apiUrl";
const apiUrl = API_URL;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const matchValues = (value1, value2) => {
  return value1 === value2 ? true : false;
};

const fetcher = (endpoint, method = "get", body) => {
  const apiUrl = API_URL;

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

const sendEmail = (isHtml, html, subject, text, to) => {
  const email = {
    isHtml: isHtml,
    html: html,
    subject: subject,
    text: "",
    to: to,
  };

  return fetch(`${apiUrl}/send-email`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
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

function generateCode(length) {
  const chars = "0123456789";
  const charsLength = chars.length;

  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    code += chars.charAt(randomIndex);
  }

  return code;
}

export {
  validateEmail,
  matchValues,
  fetcher,
  renderStatus,
  arrayFilter,
  sendEmail,
  generateCode,
};
