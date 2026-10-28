// ---------- Dados ----------
const $ = (s) => document.querySelector(s);
const brl = (n) =>
  (n || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const esc = (s) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );

const hoje = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);

let S = {
  tx: [],
  pat: [],
  cfg: { renda: 5000, anos: 15, ret: 6, ap: 0 },
  comp: [
    ["Caixinha", 100],
    ["CDB A", 102],
    ["CDB B", 107],
  ],
};

try {
  const r = localStorage.getItem("fin1");
  if (r) S = Object.assign(S, JSON.parse(r));
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem("fin1", JSON.stringify(S));
  } catch (e) {}
};

const patTotal = () =>
  S.pat.reduce((t, p) => t + (p.t === "t" ? -p.v : p.v), 0);

// ---------- Abas ----------
$("#nav").addEventListener("click", (e) => {
  const t = e.target.dataset.t;
  if (!t) return;
  document
    .querySelectorAll("nav button,section")
    .forEach((el) => el.classList.remove("on"));
  e.target.classList.add("on");
  $("#" + t).classList.add("on");
  render();
});

// ---------- Painel ----------
function grafico() {
  const pts = [];
  let acc = 0;
  [...S.pat]
    .sort((a, b) => a.d.localeCompare(b.d))
    .forEach((p) => {
      acc += p.t === "t" ? -p.v : p.v;
      pts.push(acc);
    });

  if (pts.length < 2)
    return '<p class="mu">Registre ao menos 2 movimentos na aba Aportes para ver o gráfico.</p>';

  const W = 600,
    H = 180,
    mx = Math.max(...pts),
    mn = Math.min(0, ...pts),
    rg = mx - mn || 1;

  const xy = pts.map((v, i) => [
    10 + (i * (W - 20)) / (pts.length - 1),
    H - 15 - ((v - mn) / rg) * (H - 30),
  ]);

  const l = xy.map((p) => p.join(",")).join(" ");

  return `<svg viewBox="0 0 ${W} ${H}"><polygon points="10,${H - 15} ${l} ${
    W - 10

  },${
    H - 15
  }" fill="var(--ac)" opacity=".15"/><polyline points="${l}" fill="none" stroke="var(--ac)" stroke-width="3"/><text x="10" y="14" fill="var(--mu)" font-size="13">${brl(
    mx
  )}</text></svg>`;
}

function painel() {
  const c = S.cfg,
    alvo = (c.renda * 12) / (c.ret / 100),
    p = patTotal(),
    pc = Math.min(100, (p / alvo) * 100);

  $("#pb").style.width = pc + "%";
  $("#pt").textContent = `${pc.toFixed(1)}% de ${brl(
    alvo
  )} (patrimônio para ${brl(c.renda)}/mês a ${c.ret}% real ao ano)`;
  $("#kp").textContent = brl(p);

  const m = hoje().slice(0, 7),
    mes = S.tx.filter((t) => t.d.startsWith(m));

  const sal = mes.reduce((t, x) => t + (x.k === "e" ? x.v : -x.v), 0);
  $("#ks").textContent = brl(sal);
  $("#ks").className = "k " + (sal < 0 ? "neg" : "pos");
  $("#kg").textContent = brl(
    S.tx
      .filter((t) => t.d === hoje() && t.k === "s")
      .reduce((t, x) => t + x.v, 0)
  );

  $("#ch").innerHTML = grafico();
}

// ---------- Entradas e saídas ----------
function lanc() {
  const m = $("#lm").value,
    mes = S.tx
      .filter((t) => t.d.startsWith(m))
      .sort((a, b) => b.d.localeCompare(a.d));

  const e = mes.filter((t) => t.k === "e").reduce((t, x) => t + x.v, 0),
    s = mes.filter((t) => t.k === "s").reduce((t, x) => t + x.v, 0);

  $("#le").textContent = brl(e);
  $("#ls").textContent = brl(s);
  $("#lb").textContent = brl(e - s);

  const dias = {};

  mes
    .filter((t) => t.k === "s")
    .forEach((t) => (dias[t.d] = (dias[t.d] || 0) + t.v));
  $("#ldia").innerHTML =
    Object.keys(dias)
      .sort()
      .reverse()
      .map(
        (d) =>
          `<div class="li"><span>${d
            .split("-")
            .reverse()
            .join("/")}</span><b>${brl(dias[d])}</b></div>`
      )
      .join("") || '<p class="mu">Sem gastos neste mês.</p>';

  $("#ll").innerHTML =
    mes
      .map(
        (t) =>
          `<div class="li"><span>${t.d.slice(8)}/${t.d.slice(5, 7)} · ${esc(
            t.de || "Sem descrição"
          )} <small>(${esc(t.c)})</small></span><span class="${
            t.k === "e" ? "pos" : "neg"
          }">${t.k === "e" ? "+" : "−"}${brl(t.v)} <button class="x" data-id="${
            t.id
          }" data-l="tx">✕</button></span></div>`
      )
      .join("") || '<p class="mu">Nenhum lançamento.</p>';
}

$("#la").addEventListener("click", () => {
  const v = parseFloat($("#lv").value);
  if (!(v > 0)) return alert("Informe um valor maior que zero.");
  S.tx.push({
    id: Date.now(),
    k: $("#lt").value,
    v,
    d: $("#ld").value || hoje(),
    de: $("#lde").value.trim(),
    c: $("#lc").value,
  });
  $("#lv").value = "";
  $("#lde").value = "";
  save();
  render();
});

// ---------- Aportes ----------
function pat() {
  $("#pk").textContent = brl(patTotal());
  const nm = { a: "Aporte", r: "Rendimento", t: "Retirada" };

  $("#pl").innerHTML =
    [...S.pat]
      .sort((a, b) => b.d.localeCompare(a.d))
      .map(
        (p) =>
          `<div class="li"><span>${p.d.split("-").reverse().join("/")} · ${
            nm[p.t]
          }</span><span class="${p.t === "t" ? "neg" : "pos"}">${
            p.t === "t" ? "−" : "+"
          }${brl(p.v)} <button class="x" data-id="${
            p.id
          }" data-l="pat">✕</button></span></div>`
      )
      .join("") || '<p class="mu">Nenhum movimento ainda.</p>';
}

$("#pa").addEventListener("click", () => {
  const v = parseFloat($("#pv").value);
  if (!(v > 0)) return alert("Informe um valor maior que zero.");

  S.pat.push({
    id: Date.now(),
    t: $("#pt2").value,
    v,
    d: $("#pd").value || hoje(),
  });
  $("#pv").value = "";

  save();
  render();
});

document.addEventListener("click", (e) => {
  const b = e.target.closest(".x");
  if (!b) return;
  S[b.dataset.l] = S[b.dataset.l].filter((x) => x.id != b.dataset.id);
  save();
  render();
});

// ---------- Simulador ----------
function sim() {
  const c = S.cfg;
  c.renda = parseFloat($("#s1").value) || 0;
  c.anos = Math.max(1, parseInt($("#s2").value) || 1);
  c.ret = Math.max(0.1, parseFloat($("#s3").value) || 6);
  c.ap = parseFloat($("#s4").value) || 0;
  save();

  const r = c.ret / 100,
    i = Math.pow(1 + r, 1 / 12) - 1,
    n = c.anos * 12,
    p = patTotal();

  const alvo = (c.renda * 12) / r,
    fa = (Math.pow(1 + i, n) - 1) / i,
    fvp = p * Math.pow(1 + i, n);
  const pmt = Math.max(0, (alvo - fvp) / fa),
    fv = fvp + c.ap * fa;

  $(
    "#so"
  ).innerHTML = `<div class="grid"><div><small>Patrimônio necessário</small><div class="k">${brl(
    alvo
  )}</div></div><div><small>Aporte mensal necessário</small><div class="k pos">${brl(
    pmt
  )}</div></div><div><small>Com ${brl(c.ap)}/mês</small><div class="k">${brl(
    (fv * r) / 12
  )}/mês de renda</div></div></div>`;
}

// ---------- Comparador ----------
function comp() {
  const v = parseFloat($("#c1").value) || 0,
    meses = parseFloat($("#c2").value) || 1,
    cdi = parseFloat($("#c3").value) || 0;

  const dias = Math.round((meses * 365) / 12),
    du = Math.round((dias * 252) / 365),
    di = Math.pow(1 + cdi / 100, 1 / 252) - 1;
  const ir =
    dias <= 180 ? 0.225 : dias <= 360 ? 0.2 : dias <= 720 ? 0.175 : 0.15;

  const res = S.comp.map(([nome, pct]) => {
    const g = v * (Math.pow(1 + (di * pct) / 100, du) - 1);
    return { nome, pct, g, n: g * (1 - ir) };
  });

  const best = Math.max(...res.map((r) => r.n));

  $("#cr").innerHTML = `<p class="mu">IR aplicado: ${(ir * 100)
    .toFixed(1)
    .replace(".", ",")}% (${dias} dias)</p>`;
    
  $("#ct").innerHTML =
    "<tr><th>Opção</th><th>% CDI</th><th>Bruto</th><th>Líquido</th></tr>" +
    res
      .map(
        (r, k) =>
          `<tr><td><input data-k="${k}" data-f="0" value="${esc(
            r.nome
          )}"></td><td><input data-k="${k}" data-f="1" type="number" value="${
            r.pct
          }"></td><td>${brl(r.g)}</td><td><b class="${
            r.n === best ? "pos" : ""
          }">${brl(r.n)}</b></td></tr>`
      )
      .join("");
}

$("#ct").addEventListener("change", (e) => {
  const k = e.target.dataset.k;
  if (k == null) return;
  S.comp[k][e.target.dataset.f] =
    e.target.dataset.f == 1 ? parseFloat(e.target.value) || 0 : e.target.value;
  save();
  comp();
});

["c1", "c2", "c3"].forEach((id) => $("#" + id).addEventListener("input", comp));
["s1", "s2", "s3", "s4"].forEach((id) =>
  $("#" + id).addEventListener("input", sim)
);

// ---------- Início ----------
function render() {
  painel();
  lanc();
  pat();
  sim();
  comp();
}
$("#ld").value = $("#pd").value = hoje();
$("#lm").value = hoje().slice(0, 7);
$("#lm").addEventListener("change", lanc);
$("#s1").value = S.cfg.renda;
$("#s2").value = S.cfg.anos;
$("#s3").value = S.cfg.ret;
$("#s4").value = S.cfg.ap;
render();
