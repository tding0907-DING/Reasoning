let SOURCES=[], board=[], activeSource=null;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
async function init(){try{const r=await fetch('sources.json');SOURCES=await r.json();}catch(e){$('#sourceGrid').innerHTML='<p class="empty">史料库加载失败，请通过本地服务器或GitHub Pages打开网页。</p>';return;}renderSources();renderBoard();bind();}
function bind(){
 $$('.tab').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
 $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.goto)));
 $('#search').addEventListener('input',renderSources);$('#category').addEventListener('change',renderSources);$('#kind').addEventListener('change',renderSources);
 $('#askEvidence').onclick=()=>assistant('evidence');$('#askCounter').onclick=()=>assistant('counter');$('#askNext').onclick=()=>assistant('next');
 $('#fillFromWorkbench').onclick=fillReport;$('#exportReport').onclick=exportReport;
 $$('[data-close]').forEach(x=>x.addEventListener('click',closeDetail));
}
function showTab(id){$$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));$$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='workbench')renderWorkEvidence();}
function renderSources(){
 const q=$('#search').value.trim().toLowerCase(),cat=$('#category').value,kind=$('#kind').value;
 const filtered=SOURCES.filter(s=>(!cat||s.category===cat)&&(!kind||s.type.includes(kind))&&(!q||[s.title,s.summary,s.category,s.type,s.institution].join(' ').toLowerCase().includes(q)));
 $('#sourceGrid').innerHTML=filtered.map(s=>`<article class="source-card" data-id="${s.id}"><div class="source-top"><span>${s.id} / ${s.category}</span><span>↗</span></div><h3>${esc(s.title)}</h3><p>${esc(s.summary.slice(0,86))}…</p><div class="source-foot"><span>${s.date}</span><span class="type-pill">${s.type.split('·')[0]}</span></div></article>`).join('')||'<p class="empty">没有找到符合条件的材料。</p>';
 $$('.source-card').forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
}
function openDetail(id){activeSource=SOURCES.find(s=>s.id===id);const s=activeSource;$('#detailContent').innerHTML=`
 <div class="eyebrow">${s.id} · ${esc(s.category)}</div><h2>${esc(s.title)}</h2><div class="detail-meta">${esc(s.date)}　|　${esc(s.type)}<br>${esc(s.creator)}<br>来源：${esc(s.institution)}<br>访问情况：${esc(s.access)}</div>
 <h4>史料内容 / MATERIAL</h4><p>${esc(s.summary)}</p><div class="quote">${esc(s.excerpt)}</div>
 <h4>可以怎样调查？</h4><ul>${s.questions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
 <h4>这份材料可以支持</h4><ul>${s.supports.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
 <h4>使用时需要注意</h4><ul>${s.limits.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
 <h4>版权与使用说明</h4><p>${esc(s.rights)}</p>
 <div class="detail-actions"><button class="primary" id="addEvidence">${board.includes(id)?'已在证据板中':'加入证据板 +'}</button><a href="${s.url}" target="_blank" rel="noopener">打开原始来源网站 ↗</a></div>`;
 $('#sourceDetail').classList.remove('hidden');$('#addEvidence').onclick=()=>{if(!board.includes(id))board.push(id);renderBoard();renderWorkEvidence();$('#addEvidence').textContent='已在证据板中';};
}
function closeDetail(){$('#sourceDetail').classList.add('hidden')}
function renderBoard(){
 $('#evidenceCount').textContent=board.length;$('#boardNum').textContent=board.length;
 $('#boardItems').innerHTML=board.length?board.map(id=>{let s=SOURCES.find(x=>x.id===id);return `<div class="board-item"><button data-remove="${id}">移除 ×</button><b>${id}</b>　${esc(s.title)}</div>`}).join(''):'<p class="empty">尚未收藏史料。<br>打开档案，选择“加入证据板”。</p>';
 $$('[data-remove]').forEach(b=>b.onclick=()=>{board=board.filter(x=>x!==b.dataset.remove);renderBoard();renderWorkEvidence();});
}
function renderWorkEvidence(){
 $('#workEvidence').innerHTML=board.length?board.map(id=>{let s=SOURCES.find(x=>x.id===id);return `<div><b>${id}｜${esc(s.title)}</b><br><span>${esc(s.supports[0])}</span></div>`}).join(''):'<p class="empty">请先从档案室选择史料。</p>';
}
function assistant(mode){
 const h=$('#hypothesis').value.trim(),r=$('#reasoning').value.trim(),c=$('#counter').value.trim();
 let msg='';
 if(mode==='evidence'){
  if(!board.length)msg='你还没有把史料加入证据板。先选择一份材料，再尝试说明它支持哪一个具体判断。';
  else {const types=board.map(id=>SOURCES.find(s=>s.id===id));msg=`你目前选择了${types.length}份材料。建议逐条检查：\n${types.map(s=>`• ${s.id}：${s.title}——${s.supports[0]}。注意：${s.limits[0]}。`).join('\n')}\n\n下一步：不要只写“这说明英国条件优越”，请补充材料呈现的具体信息，以及它与观点之间的联系。`;}
 } else if(mode==='counter'){
  const hasLater=board.some(id=>['A02','A03'].includes(id)),hasResearch=board.includes('A04');
  msg=(hasLater?'你选入了工厂法或监察员报告。这些材料主要反映工业化的社会后果和制度回应，时间上晚于工业革命的起步阶段。':'试着检查史料的形成时间：它是在工业革命发生前、发生过程中，还是发生之后？')+
  (hasResearch?' 你还选择了职业结构重建数据，它可能修正“工业革命时期才开始工业化”的简单叙述。':' 你可以寻找一份与当前解释不完全一致的材料，避免只收集支持自己观点的证据。')+
  (c?'\n你已经记录了反向解释，可以进一步说明它与原假设的关系。':'\n请在“反证与修正”栏写下：现有证据还不能证明什么？');
 } else {
  msg=!h?'先写下一句初步假设，再选择史料。':!board.length?'你已经有初步假设。现在进入档案室，寻找一份能支持或挑战它的材料。':!r?'你已经有假设和证据。试着补全“材料呈现了……，因此可以支持……，因为……”这条推理链。':'尝试把不同材料联系起来：它们是分别说明不同条件，还是能够共同解释一个因果过程？同时注意区分背景条件、直接推动因素和后续影响。';
 }
 addBubble(msg,'bot');
}
function addBubble(t,kind){let d=document.createElement('div');d.className='bubble '+kind;d.textContent=t;$('#chat').appendChild(d);$('#chat').scrollTop=$('#chat').scrollHeight}
function fillReport(){
 $('#finalClaim').value=$('#hypothesis').value;$('#finalReason').value=$('#reasoning').value;
 const lines=board.map(id=>{let s=SOURCES.find(x=>x.id===id);return `${id}《${s.title}》：${s.supports[0]}。来源：${s.institution}。`});
 $('#finalEvidence').value=lines.join('\n');
 $('#finalLimit').value=$('#counter').value;
 showTab('report');
}
function exportReport(){
 const fields=[['一、核心判断',$('#finalClaim').value],['二、关键证据及其作用',$('#finalEvidence').value],['三、因果关系与历史解释',$('#finalReason').value],['四、反证、局限与仍待回答的问题',$('#finalLimit').value]];
 const content='HistoriA · 历史推理局\\n案件001：蒸汽时代的起点\\n结案报告\\n\\n'+fields.map(x=>x[0]+'\\n'+(x[1]||'（未填写）')).join('\\n\\n')+'\\n\\n调查史料：\\n'+board.map(id=>{let s=SOURCES.find(x=>x.id===id);return `${id} ${s.title}｜${s.institution}｜${s.url}`}).join('\\n');
 const blob=new Blob(['\\ufeff'+content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='HistoriA_案件001_结案报告.txt';a.click();URL.revokeObjectURL(url);
 const filled=fields.filter(x=>x[1].trim()).length;
 $('#review').classList.remove('hidden');$('#review').innerHTML=`<b>报告完整度提示（非成绩评定）</b><br>目前填写了 ${filled}/4 个部分，证据板收录 ${board.length} 份材料。请检查报告是否做到：明确提出判断、引用具体史料、解释证据与观点的联系，并说明材料局限。网页不会仅凭字数或关键词给出历史思维能力评分。`;
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
init();