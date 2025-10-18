/* src/shared/SemanticSearch.js */
const SYNONYMS = {
  energy:["iso50001","50001","energy","ems"],
  environment:["iso14001","14001","environment","env","ems"],
  safety:["iso45001","45001","safety","ohs"],
  finance:["ifrs","issb","s1","s2","financial","finance"],
  overdue:["late","outstanding","overdue","due"],
  completed:["done","complete","completed"],
  progress:["in-progress","progress","ongoing","started"],
};
const EXTRA = new Map(Object.entries(SYNONYMS).flatMap(([k,arr])=>arr.map(w=>[w,k])));

export function tokenize(s){
  return String(s||"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g," ")
    .split(" ")
    .filter(Boolean)
    .map(t => EXTRA.get(t) || t);
}

export function scoreQuery(queryTokens, docTokens){
  if(!queryTokens.length || !docTokens.length) return 0;
  const docFreq = new Map(); docTokens.forEach(t=>docFreq.set(t,(docFreq.get(t)||0)+1));
  let s = 0;
  const set = new Set(docTokens);
  for(const q of queryTokens){
    if(set.has(q)) { s += (1 + (docFreq.get(q)||0)); } // TF-ish
  }
  return s;
}

export function buildIndex(items, fields){
  return items.map((it)=>{
    const text = fields.map(f=>String(it[f]||"")).join(" ");
    const tokens = tokenize(text);
    return { it, tokens };
  });
}

export function search(index, query, { minScore = 1 } = {}){
  const q = tokenize(query);
  if(!q.length) return [];
  const results = index.map(row => ({ row, s: scoreQuery(q, row.tokens) }))
    .filter(x => x.s >= minScore)
    .sort((a,b)=>b.s - a.s)
    .map(x => x.row.it);
  return results;
}
