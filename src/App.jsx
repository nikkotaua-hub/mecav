import { useState, useEffect, useCallback } from "react"; //2
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://makzoampzbftlarxkbmp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ha3pvYW1wemJmdGxhcnhrYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjUwNTAsImV4cCI6MjA5MTY0MTA1MH0.GjauxTULoP2tAOxL_0sO2RNJQRf6AoTA1PIR2CLIA5U";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATTERIES_INIT = [
  { ref: "AR00032", lib: "62 HA + DROIT ORION",  rythme: 3.0, phys: "", ebp: "" },
  { ref: "AR00035", lib: "70 HA + DROIT ORION",  rythme: 1.4, phys: "", ebp: "" },
  { ref: "AR00034", lib: "50 HA + DROIT ORION",  rythme: 0.7, phys: "", ebp: "" },
  { ref: "AR00022", lib: "95 HA + DROIT ORION",  rythme: 0.3, phys: "", ebp: "" },
  { ref: "AR00030", lib: "70 HA + GAUCHE ORION", rythme: 0.3, phys: "", ebp: "" },
  { ref: "AR00036", lib: "95 HA + GAUCHE",       rythme: 0.2, phys: "", ebp: "" },
  { ref: "AR00150", lib: "62 HA + DROIT SOLITE", rythme: 0.0, phys: "", ebp: "" },
  { ref: "AR00246", lib: "75 HA + DROIT MONBAT", rythme: 0.0, phys: "", ebp: "" },
];
const PNEUS_INIT = [
  { ref: "AR00103", lib: "215/65R16 GOODRIDE",  rythme: 5.8, phys: "", ebp: "" },
  { ref: "AR00197", lib: "185/65R15 GOODRIDE",  rythme: 4.8, phys: "", ebp: "" },
  { ref: "AR00167", lib: "175/65R14 MINERVA",   rythme: 4.0, phys: "", ebp: "" },
  { ref: "AR00166", lib: "195/55R16 MINERVA",   rythme: 1.9, phys: "", ebp: "" },
  { ref: "AR00064", lib: "185/65R15 MINERVA",   rythme: 1.5, phys: "", ebp: "" },
  { ref: "AR00199", lib: "175/70R14 MINERVA",   rythme: 1.5, phys: "", ebp: "" },
  { ref: "AR00060", lib: "175/65R15 GOODRIDE",  rythme: 1.3, phys: "", ebp: "" },
  { ref: "AR00046", lib: "175R13C ROADX",       rythme: 0.9, phys: "", ebp: "" },
  { ref: "AR00049", lib: "165/65R14 ROADX",     rythme: 0.8, phys: "", ebp: "" },
  { ref: "AR00047", lib: "165/60R14 GOODRIDE",  rythme: 0.7, phys: "", ebp: "" },
  { ref: "AR00233", lib: "205/80R16 MINERVA",   rythme: 0.6, phys: "", ebp: "" },
  { ref: "AR00119", lib: "245/70R16 GOODRIDE",  rythme: 0.5, phys: "", ebp: "" },
  { ref: "AR00070", lib: "195/65R15 GOOD RIDE", rythme: 0.5, phys: "", ebp: "" },
  { ref: "AR00094", lib: "205/55R16 GOODRIDE",  rythme: 0.5, phys: "", ebp: "" },
  { ref: "AR00096", lib: "205/60R16 GOODRIDE",  rythme: 0.5, phys: "", ebp: "" },
];
const HUILES_INIT = [
  { ref: "AR00005", lib: "10W40 (Litres)", rythme: 30.9, phys: "", ebp: "" },
  { ref: "AR00006", lib: "5W30 (Litres)",  rythme: 26.8, phys: "", ebp: "" },
];

const getSemaine = () => {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
};
const seuilCalc  = (r, m) => Math.round(r * m);
const cmdCalc    = (p, r, m) => {
  if (p === "" || p === null) return null;
  return Number(p) < seuilCalc(r, m) ? Math.max(0, Math.round(r * 6) - Number(p)) : 0;
};
const statutCalc = (p, r, m) => {
  if (p === "" || p === null) return "vide";
  const s = seuilCalc(r, m), n = Number(p);
  if (n < s) return "danger";
  if (n < s * 1.5) return "warn";
  return "ok";
};
const volumeFut = (diam, h) => {
  if (!diam || h === "" || h === null) return null;
  const rad = diam / 200;
  return Math.round(Math.PI * rad * rad * Number(h) * 1000 * 10) / 10;
};
const fmtDate = (d) => {
  if (!d) return "";
  const [y, m, j] = d.split("-");
  return `${j}/${m}/${y}`;
};

const GF = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box}input[type=number]::-webkit-inner-spin-button{opacity:.4}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#010409}::-webkit-scrollbar-thumb{background:#21262d;border-radius:3px}`;

const Badge = ({ s }) => {
  const M = { danger:["#2d0a0a","#ff6b6b","RUPTURE"], warn:["#2d1f00","#ffb347","ALERTE"], ok:["#0a2d0a","#5dbb63","OK"], vide:["#1a1a1a","#555","—"] };
  const [bg, text, label] = M[s] || M.vide;
  return <span style={{ background:bg, color:text, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, letterSpacing:"0.08em", fontFamily:"monospace" }}>{label}</span>;
};

const Num = ({ value, onChange }) => (
  <input type="number" min={0} value={value} placeholder="—"
    onChange={e => onChange(e.target.value === "" ? "" : Number(e.target.value))}
    style={{ width:72, padding:"5px 8px", background:"#0d1117", border:"1px solid #30363d", borderRadius:6, color:"#e6edf3", fontSize:13, textAlign:"center", fontFamily:"'DM Mono',monospace", outline:"none" }}
    onFocus={e => e.target.style.borderColor="#f0a500"}
    onBlur={e  => e.target.style.borderColor="#30363d"}
  />
);

const TableSection = ({ titre, color, items, setItems, seuilMult, readOnly }) => {
  const upd = (i, f, v) => { const n=[...items]; n[i]={...n[i],[f]:v}; setItems(n); };
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ width:4, height:28, background:color, borderRadius:2 }} />
        <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:"#e6edf3", fontFamily:"'Space Grotesk',sans-serif" }}>{titre}</h2>
        <span style={{ fontSize:11, color:"#555", fontFamily:"'DM Mono',monospace", marginLeft:"auto" }}>seuil = rythme × {seuilMult} sem.</span>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #21262d" }}>
              {["Référence","Libellé","Rythme·sem","Physique","EBP","Écart","Seuil","À commander","Statut"].map(h => (
                <th key={h} style={{ padding:"8px 12px", textAlign:h==="Libellé"?"left":"center", color:"#8b949e", fontWeight:500, fontSize:11, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const ecart = it.phys!==""&&it.ebp!=="" ? Number(it.ebp)-Number(it.phys) : null;
              const s=seuilCalc(it.rythme,seuilMult), cmd=cmdCalc(it.phys,it.rythme,seuilMult), st=statutCalc(it.phys,it.rythme,seuilMult);
              const bg = i%2===0?"transparent":"#0d1117";
              return (
                <tr key={it.ref} style={{ background:bg, borderBottom:"1px solid #161b22" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#161b22"}
                  onMouseLeave={e=>e.currentTarget.style.background=bg}>
                  <td style={{ padding:"8px 12px", color:"#f0a500", fontFamily:"'DM Mono',monospace", fontSize:12, whiteSpace:"nowrap" }}>{it.ref}</td>
                  <td style={{ padding:"8px 12px", color:"#e6edf3" }}>{it.lib}</td>
                  <td style={{ padding:"8px 12px", textAlign:"center", color:"#8b949e", fontFamily:"'DM Mono',monospace" }}>{it.rythme.toFixed(1)}</td>
                  <td style={{ padding:"6px 12px", textAlign:"center" }}>
                    {readOnly
                      ? <span style={{ fontFamily:"'DM Mono',monospace", color:"#e6edf3" }}>{it.phys===""?"—":it.phys}</span>
                      : <Num value={it.phys} onChange={v=>upd(i,"phys",v)} />}
                  </td>
                  <td style={{ padding:"6px 12px", textAlign:"center" }}>
                    {readOnly
                      ? <span style={{ fontFamily:"'DM Mono',monospace", color:"#e6edf3" }}>{it.ebp===""?"—":it.ebp}</span>
                      : <Num value={it.ebp} onChange={v=>upd(i,"ebp",v)} />}
                  </td>
                  <td style={{ padding:"8px 12px", textAlign:"center", fontFamily:"'DM Mono',monospace", fontWeight:600, color:ecart===null?"#444":Math.abs(ecart)>1?"#ff6b6b":"#5dbb63" }}>
                    {ecart===null?"—":ecart>0?`+${ecart}`:ecart}
                  </td>
                  <td style={{ padding:"8px 12px", textAlign:"center", color:"#8b949e", fontFamily:"'DM Mono',monospace" }}>{s}</td>
                  <td style={{ padding:"8px 12px", textAlign:"center", fontFamily:"'DM Mono',monospace", fontWeight:700, fontSize:14, color:cmd===null?"#444":cmd>0?"#ff6b6b":"#5dbb63" }}>
                    {cmd===null?"—":cmd===0?"✓":cmd}
                  </td>
                  <td style={{ padding:"8px 12px", textAlign:"center" }}><Badge s={st} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Jaugeage = ({ diam, setDiam, hauteurs, setHauteurs }) => (
  <div style={{ marginBottom:40 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
      <div style={{ width:4, height:28, background:"#a78bfa", borderRadius:2 }} />
      <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:"#e6edf3", fontFamily:"'Space Grotesk',sans-serif" }}>Jaugeage fûts d'huile</h2>
      <span style={{ fontSize:11, color:"#555", fontFamily:"'DM Mono',monospace", marginLeft:"auto" }}>V = π × (d/2)² × h</span>
    </div>
    <div style={{ background:"#0d1117", border:"1px solid #21262d", borderRadius:8, padding:"10px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
      <span style={{ fontSize:12, color:"#8b949e" }}>Diamètre fût :</span>
      <Num value={diam} onChange={setDiam} />
      <span style={{ fontSize:12, color:"#555" }}>cm — Section = {Math.round(Math.PI*(diam/2)*(diam/2))} cm²</span>
    </div>
    <div style={{ display:"flex", gap:12 }}>
      {HUILES_INIT.map((h, i) => {
        const vol = volumeFut(diam, hauteurs[i]);
        return (
          <div key={h.ref} style={{ background:"#0d1117", border:"1px solid #21262d", borderRadius:10, padding:"16px 20px", flex:1, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"#8b949e", marginBottom:6, fontFamily:"'DM Mono',monospace" }}>{h.lib} — hauteur lue</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Num value={hauteurs[i]} onChange={v=>{ const n=[...hauteurs]; n[i]=v; setHauteurs(n); }} />
                <span style={{ color:"#555", fontSize:12 }}>m</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:"#8b949e", marginBottom:4, fontFamily:"'DM Mono',monospace" }}>Volume calculé</div>
              <div style={{ fontSize:26, fontWeight:700, color:vol!==null?"#f0a500":"#333", fontFamily:"'DM Mono',monospace" }}>{vol!==null?`${vol} L`:"—"}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const Alertes = ({ batteries, pneus, huiles }) => {
  const nb = [...batteries,...pneus].filter(it=>it.phys!==""&&Number(it.phys)<seuilCalc(it.rythme,2)).length
           + huiles.filter(it=>it.phys!==""&&Number(it.phys)<seuilCalc(it.rythme,3)).length;
  return nb===0
    ? <div style={{ background:"#0a2d0a", border:"1px solid #1a5c1a", borderRadius:8, padding:"10px 20px", marginBottom:24, display:"flex", gap:10, alignItems:"center" }}><span>✓</span><span style={{ color:"#5dbb63", fontSize:13, fontWeight:500 }}>Tous les stocks renseignés sont au-dessus du seuil.</span></div>
    : <div style={{ background:"#2d0a0a", border:"1px solid #5c1a1a", borderRadius:8, padding:"10px 20px", marginBottom:24, display:"flex", gap:10, alignItems:"center" }}><span>⚠</span><span style={{ color:"#ff6b6b", fontSize:13, fontWeight:600 }}>{nb} référence{nb>1?"s":""} sous le seuil minimum — commande urgente</span></div>;
};

// ─── Onglet Historique ────────────────────────────────────────────────────────
const Historique = () => {
  const [dates,       setDates]       = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [detail,      setDetail]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [famOnglet,   setFamOnglet]   = useState("batterie");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("releves")
        .select("date_releve, semaine")
        .order("date_releve", { ascending: false });
      if (data) {
        const unique = [...new Map(data.map(r => [r.date_releve, r])).values()];
        setDates(unique);
        if (unique.length > 0) loadDetail(unique[0].date_releve);
      }
      setLoading(false);
    })();
  }, []);

  const loadDetail = async (date) => {
    setLoadingDetail(true);
    setSelected(date);
    const { data } = await supabase
      .from("releves")
      .select("*")
      .eq("date_releve", date)
      .order("famille")
      .order("ref_article");
    if (data) setDetail(data);
    setLoadingDetail(false);
  };

  const buildItems = (init, fam) => init.map(it => {
    const row = detail?.find(r => r.famille === fam && r.ref_article === it.ref);
    return row ? { ...it, phys: row.stock_physique ?? "", ebp: row.stock_ebp ?? "" } : it;
  });

  const FAM = [
    { id:"batterie", label:"Batteries", color:"#f0a500", init:BATTERIES_INIT, mult:2 },
    { id:"pneu",     label:"Pneus",     color:"#4fc3f7", init:PNEUS_INIT,     mult:2 },
    { id:"huile",    label:"Huiles",    color:"#a78bfa", init:HUILES_INIT,    mult:3 },
  ];

  const nbRuptures = (date_data) => {
    if (!date_data) return 0;
    return date_data.filter(r => r.stock_physique !== null && r.stock_physique < r.seuil_mini).length;
  };

  if (loading) return <div style={{ textAlign:"center", padding:40, color:"#555", fontFamily:"'DM Mono',monospace" }}>Chargement…</div>;

  if (dates.length === 0) return (
    <div style={{ textAlign:"center", padding:60, color:"#555" }}>
      <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13 }}>Aucun relevé enregistré pour l'instant.</div>
      <div style={{ fontSize:12, color:"#444", marginTop:6 }}>Faites votre premier relevé dans les onglets Batteries, Pneus ou Huiles.</div>
    </div>
  );

  return (
    <div style={{ display:"flex", gap:24 }}>
      {/* Liste des dates */}
      <div style={{ width:220, flexShrink:0 }}>
        <div style={{ fontSize:11, color:"#8b949e", fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em", marginBottom:12 }}>RELEVÉS ENREGISTRÉS</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {dates.map(({ date_releve, semaine }) => (
            <button key={date_releve} onClick={() => loadDetail(date_releve)} style={{
              background: selected===date_releve ? "#161b22" : "transparent",
              border: selected===date_releve ? "1px solid #f0a500" : "1px solid #21262d",
              borderRadius:8, padding:"10px 14px", cursor:"pointer",
              textAlign:"left", transition:"all .15s",
            }}>
              <div style={{ fontSize:13, fontWeight:600, color: selected===date_releve?"#f0a500":"#e6edf3", fontFamily:"'DM Mono',monospace" }}>
                {fmtDate(date_releve)}
              </div>
              <div style={{ fontSize:11, color:"#555", marginTop:2, fontFamily:"'DM Mono',monospace" }}>
                Sem. {String(semaine).padStart(2,"0")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Détail du relevé sélectionné */}
      <div style={{ flex:1, minWidth:0 }}>
        {loadingDetail && <div style={{ textAlign:"center", padding:40, color:"#555", fontFamily:"'DM Mono',monospace" }}>Chargement…</div>}

        {!loadingDetail && detail && (
          <>
            {/* Barre titre + stats */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, padding:"14px 20px", background:"#0d1117", border:"1px solid #21262d", borderRadius:10 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:"#e6edf3", fontFamily:"'DM Mono',monospace" }}>{fmtDate(selected)}</div>
                <div style={{ fontSize:11, color:"#555", marginTop:2 }}>Relevé complet — {detail.length} articles</div>
              </div>
              <div style={{ marginLeft:"auto", display:"flex", gap:16 }}>
                {[
                  { label:"Ruptures", val: detail.filter(r=>r.stock_physique!==null&&r.seuil_mini!==null&&r.stock_physique<r.seuil_mini).length, color:"#ff6b6b" },
                  { label:"Alertes",  val: detail.filter(r=>r.stock_physique!==null&&r.seuil_mini!==null&&r.stock_physique>=r.seuil_mini&&r.stock_physique<r.seuil_mini*1.5).length, color:"#ffb347" },
                  { label:"OK",       val: detail.filter(r=>r.stock_physique!==null&&r.seuil_mini!==null&&r.stock_physique>=r.seuil_mini*1.5).length, color:"#5dbb63" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:700, color, fontFamily:"'DM Mono',monospace" }}>{val}</div>
                    <div style={{ fontSize:10, color:"#555", letterSpacing:"0.05em" }}>{label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sous-onglets famille */}
            <div style={{ display:"flex", gap:4, marginBottom:24, borderBottom:"1px solid #21262d" }}>
              {FAM.map(f => (
                <button key={f.id} onClick={()=>setFamOnglet(f.id)} style={{
                  background:"transparent", border:"none",
                  borderBottom: famOnglet===f.id?`2px solid ${f.color}`:"2px solid transparent",
                  color: famOnglet===f.id?f.color:"#8b949e",
                  padding:"8px 18px", cursor:"pointer", fontSize:13, fontWeight:600,
                  fontFamily:"'Space Grotesk',sans-serif", marginBottom:-1,
                }}>{f.label}</button>
              ))}
            </div>

            {/* Tableau lecture seule */}
            {FAM.filter(f=>f.id===famOnglet).map(f => (
              <TableSection
                key={f.id}
                titre={f.label}
                color={f.color}
                items={buildItems(f.init, f.id)}
                setItems={()=>{}}
                seuilMult={f.mult}
                readOnly={true}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────
const LoginScreen = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const login = async () => {
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:"#010409", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Space Grotesk',sans-serif" }}>
      <style>{GF}</style>
      <div style={{ background:"#0d1117", border:"1px solid #21262d", borderRadius:12, padding:"32px 28px", width:360 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,#f0a500,#e05c00)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#010409" }}>M</div>
          <div><div style={{ fontSize:16, fontWeight:700, color:"#e6edf3" }}>Meca-V</div><div style={{ fontSize:11, color:"#8b949e", fontFamily:"'DM Mono',monospace" }}>Suivi stock consommables</div></div>
        </div>
        {[["EMAIL","email",email,setEmail],["MOT DE PASSE","password",password,setPassword]].map(([lbl,type,val,set])=>(
          <div key={lbl} style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"#8b949e", marginBottom:6, fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>{lbl}</div>
            <input type={type} value={val} onChange={e=>set(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
              style={{ width:"100%", padding:"10px 14px", background:"#161b22", border:"1px solid #30363d", borderRadius:8, color:"#e6edf3", fontSize:14, outline:"none", fontFamily:"'DM Mono',monospace" }} />
          </div>
        ))}
        {error && <div style={{ background:"#2d0a0a", border:"1px solid #5c1a1a", borderRadius:6, padding:"8px 12px", marginBottom:14, fontSize:12, color:"#ff6b6b" }}>{error}</div>}
        <button onClick={login} disabled={loading} style={{ width:"100%", padding:11, background:"#f0a500", border:"none", borderRadius:8, color:"#010409", fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, fontFamily:"'Space Grotesk',sans-serif", marginTop:4 }}>
          {loading?"Connexion…":"SE CONNECTER"}
        </button>
      </div>
    </div>
  );
};

// ─── App principale ───────────────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [batteries, setBatteries] = useState(BATTERIES_INIT);
  const [pneus,     setPneus]     = useState(PNEUS_INIT);
  const [huiles,    setHuiles]    = useState(HUILES_INIT);
  const [diam,      setDiam]      = useState(56);
  const [hauteurs,  setHauteurs]  = useState(["",""]);
  const [onglet,    setOnglet]    = useState("batteries");
  const [date,      setDate]      = useState(new Date().toISOString().slice(0,10));
  const [saveState, setSaveState] = useState("idle");
  const [lastSaved, setLastSaved] = useState(null);
  const sem = getSemaine();

  useEffect(() => {
    supabase.auth.getSession().then(({ data:{ session }}) => { setUser(session?.user??null); setAuthReady(true); });
    const { data:{ subscription }} = supabase.auth.onAuthStateChange((_,session) => setUser(session?.user??null));
    return () => subscription.unsubscribe();
  }, []);

  const loadLast = useCallback(async () => {
    const { data } = await supabase.from("releves").select("*").order("date_releve",{ascending:false}).order("created_at",{ascending:false}).limit(200);
    if (!data?.length) return;
    const latest = data[0].date_releve;
    setLastSaved(latest);
    const rows = data.filter(r=>r.date_releve===latest);
    const apply = (init, fam) => init.map(it => {
      const row = rows.find(r=>r.famille===fam&&r.ref_article===it.ref);
      return row ? {...it, phys:row.stock_physique??"", ebp:row.stock_ebp??""} : it;
    });
    setBatteries(apply(BATTERIES_INIT,"batterie"));
    setPneus(apply(PNEUS_INIT,"pneu"));
    setHuiles(apply(HUILES_INIT,"huile"));
  }, []);

  useEffect(() => { if (user) loadLast(); }, [user, loadLast]);

  const handleSave = async () => {
    setSaveState("saving");
    const toRows = (items, fam, mult) => items.map(it => ({
      date_releve: date, semaine: sem, famille: fam,
      ref_article: it.ref, libelle: it.lib,
      stock_physique: it.phys===""?null:Number(it.phys),
      stock_ebp: it.ebp===""?null:Number(it.ebp),
      rythme: it.rythme,
      seuil_mini: seuilCalc(it.rythme, mult),
      qte_commander: cmdCalc(it.phys, it.rythme, mult),
    }));
    const { error } = await supabase.from("releves").upsert(
      [...toRows(batteries,"batterie",2),...toRows(pneus,"pneu",2),...toRows(huiles,"huile",3)],
      { onConflict:"date_releve,famille,ref_article" }
    );
    if (error) { setSaveState("error"); setTimeout(()=>setSaveState("idle"),3000); }
    else { setLastSaved(date); setSaveState("ok"); setTimeout(()=>setSaveState("idle"),2500); }
  };

  if (!authReady) return <div style={{ minHeight:"100vh", background:"#010409", display:"flex", alignItems:"center", justifyContent:"center", color:"#8b949e", fontFamily:"'DM Mono',monospace", fontSize:13 }}>Chargement…</div>;
  if (!user) return <LoginScreen />;

  const BL = {idle:"ENREGISTRER",saving:"…",ok:"✓ ENREGISTRÉ",error:"✗ ERREUR"}[saveState];
  const BC = {idle:"#f0a500",saving:"#8b949e",ok:"#5dbb63",error:"#ff6b6b"}[saveState];

  const tabs = [
    {id:"batteries", label:"Batteries", color:"#f0a500", n:batteries.length},
    {id:"pneus",     label:"Pneus",     color:"#4fc3f7", n:pneus.length},
    {id:"huiles",    label:"Huiles",    color:"#a78bfa", n:huiles.length},
    {id:"historique",label:"Historique",color:"#6ee7b7", n:null},
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#010409", fontFamily:"'Space Grotesk',sans-serif", color:"#e6edf3" }}>
      <style>{GF}</style>

      {/* Header */}
      <div style={{ borderBottom:"1px solid #21262d", padding:"0 32px", background:"#0d1117" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#f0a500,#e05c00)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#010409" }}>M</div>
            <div>
              <div style={{ fontSize:15, fontWeight:600 }}>Meca-V</div>
              <div style={{ fontSize:11, color:"#8b949e", fontFamily:"'DM Mono',monospace" }}>Suivi stock consommables</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {lastSaved && <span style={{ fontSize:11, color:"#555", fontFamily:"'DM Mono',monospace" }}>Dernier relevé : {fmtDate(lastSaved)}</span>}
            {onglet !== "historique" && <>
              <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:6, padding:"5px 12px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:"#8b949e", fontFamily:"'DM Mono',monospace" }}>Sem. {String(sem).padStart(2,"0")}</span>
                <span style={{ color:"#333" }}>|</span>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ background:"transparent", border:"none", color:"#e6edf3", fontSize:12, fontFamily:"'DM Mono',monospace", outline:"none", cursor:"pointer" }} />
              </div>
              <button onClick={handleSave} disabled={saveState==="saving"} style={{ background:"transparent", border:`1px solid ${BC}`, color:BC, padding:"7px 16px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>{BL}</button>
            </>}
            <button onClick={()=>supabase.auth.signOut()} style={{ background:"transparent", border:"1px solid #21262d", color:"#8b949e", padding:"7px 12px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"'DM Mono',monospace" }}>Déconnexion</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 32px" }}>
        {onglet !== "historique" && <Alertes batteries={batteries} pneus={pneus} huiles={huiles} />}

        {/* Onglets */}
        <div style={{ display:"flex", gap:4, marginBottom:28, borderBottom:"1px solid #21262d" }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setOnglet(t.id)} style={{
              background:"transparent", border:"none",
              borderBottom: onglet===t.id?`2px solid ${t.color}`:"2px solid transparent",
              color: onglet===t.id?t.color:"#8b949e",
              padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:600,
              fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", gap:8, marginBottom:-1,
            }}>
              {t.label}
              {t.n !== null && <span style={{ background:onglet===t.id?t.color:"#21262d", color:onglet===t.id?"#010409":"#8b949e", borderRadius:10, fontSize:10, fontWeight:700, padding:"1px 7px", fontFamily:"'DM Mono',monospace" }}>{t.n}</span>}
            </button>
          ))}
        </div>

        {onglet==="batteries"  && <TableSection titre="Batteries" color="#f0a500" items={batteries} setItems={setBatteries} seuilMult={2} readOnly={false} />}
        {onglet==="pneus"      && <TableSection titre="Pneus — Top 15" color="#4fc3f7" items={pneus} setItems={setPneus} seuilMult={2} readOnly={false} />}
        {onglet==="huiles"     && <><Jaugeage diam={diam} setDiam={setDiam} hauteurs={hauteurs} setHauteurs={setHauteurs} /><TableSection titre="Huiles moteur" color="#a78bfa" items={huiles} setItems={setHuiles} seuilMult={3} readOnly={false} /></>}
        {onglet==="historique" && <Historique />}

        <div style={{ marginTop:40, paddingTop:20, borderTop:"1px solid #161b22", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:"#444", fontFamily:"'DM Mono',monospace" }}>★ Stock physique = relevé sur place chaque lundi matin</span>
          <span style={{ fontSize:11, color:"#444", fontFamily:"'DM Mono',monospace" }}>Connecté : {user.email}</span>
        </div>
      </div>
    </div>
  );
}
