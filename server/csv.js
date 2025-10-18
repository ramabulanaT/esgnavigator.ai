import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

export async function loadAssessmentsCsv(csvDir){
  const f = ["assessments.csv","Assessments.csv"].map(x=>path.join(csvDir,x)).find(p=>fs.existsSync(p));
  if(!f) return { rows:[], loadedAt:new Date().toISOString() };
  const rows = await readCsv(f);
  const mapped = rows.map(r=>({ id:r.id||r.ID||r.assessment_id||r.external_id, name:r.name||r.assessment||r.company||r.title, status:r.status||r.state, score:r.score||r.result||r.total||r.overall, updatedAt:r.updatedAt||r.updated_at||r.last_update||r.date }));
  return { rows:mapped, loadedAt:new Date().toISOString() };
}
export function watchCsv(csvDir,onChange){
  if(!fs.existsSync(csvDir)) return;
  fs.watch(csvDir,{persistent:false},(_e,fn)=>{ if(!fn) return; if(fn.toLowerCase().includes("assessment")){ clearTimeout(watchCsv._t); watchCsv._t=setTimeout(()=>onChange?.(),250); }});
}
function readCsv(file){ return new Promise((resolve,reject)=>{ const out=[]; fs.createReadStream(file).pipe(parse({columns:true,skip_empty_lines:true,trim:true})).on("data",r=>out.push(r)).on("end",()=>resolve(out)).on("error",reject); }); }
