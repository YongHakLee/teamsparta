"use client";
import { useState } from "react";
import { sha256Hex } from "./deckSync";

export default function PassphraseGate({ expectedHash, onPass }: { expectedHash: string; onPass: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = await sha256Hex(val);
    if (h === expectedHash) { sessionStorage.setItem("lec-present-ok", "1"); onPass(); }
    else { setErr(true); setVal(""); }
  };

  return (
    <form className="lec-gate" onSubmit={submit}>
      <p className="lec-gate-title">발표자 창</p>
      <p className="lec-mut" style={{ fontSize: 13 }}>암호를 입력하면 노트가 보입니다.</p>
      <input
        type="password" autoFocus value={val}
        onChange={(e) => { setVal(e.target.value); setErr(false); }}
        placeholder="암호" aria-label="발표자 암호"
      />
      {err && <span className="lec-gate-err">암호가 일치하지 않습니다.</span>}
      <button type="submit">입장</button>
    </form>
  );
}
