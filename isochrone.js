// netlify/functions/isochrone.js
// 後端代理：前端不會看到任何 API Key
// API Key 存在 Netlify 環境變數中

exports.handler = async (event) => {
  // 只允許 POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 從環境變數讀取（永遠不會暴露給前端）
  const TT_APP_ID  = process.env.TRAVELTIME_APP_ID;
  const TT_API_KEY = process.env.TRAVELTIME_API_KEY;

  if (!TT_APP_ID || !TT_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '伺服器未設定 API Key' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    const res = await fetch('https://api.traveltimeapp.com/v4/time-map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Id': TT_APP_ID,
        'X-Api-Key': TT_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.text();

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        // 只允許你自己的網域呼叫這個 function
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
