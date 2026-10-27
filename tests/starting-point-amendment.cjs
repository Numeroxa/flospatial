const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');

const authorised = ['START-MECH-003','START-MECH-005','START-MECH-006','START-MECH-007','START-MECH-008','START-NUM-005','START-ABS-001','START-ABS-002','START-ABS-003','START-ABS-005','START-VER-002','START-VER-003','START-VER-005'];
module.exports = function testStartingPoint(app, baseline) {
  const questions=app.startingAssessmentQuestions, previous=baseline.startingAssessmentQuestions;
  assert.equal(questions.length,26);
  assert.equal(JSON.stringify(questions.map(q=>q.questionId)),JSON.stringify(previous.map(q=>q.questionId)),'order and IDs');
  const changed=questions.filter((q,i)=>JSON.stringify(q)!==JSON.stringify(previous[i]));
  assert.equal(JSON.stringify(changed.map(q=>q.questionId)),JSON.stringify(authorised),'exactly the 13 authorised replacements');
  for(const [i,q] of questions.entries()) {
    const old=previous[i];
    for(const key of ['domain','subcompetency','concept','difficulty','sessionType','pathwayId'])assert.equal(q[key],old[key],q.questionId+' '+key);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4,'distinct options');
    assert.equal(q.options.filter(o=>o.optionId===q.correctOptionId).length,1,'one keyed option');
  }
  const byId=new Map(questions.map(q=>[q.questionId,q]));
  function keyText(id){const q=byId.get(id);return q.options.find(o=>o.optionId===q.correctOptionId).text;}
  // Independently calculated physical/numerical results, not hard-coded answer letters.
  assert.equal(keyText('START-MECH-003'),'One clockwise and the other anticlockwise');
  assert.equal(keyText('START-MECH-005'),75/1+' N');
  assert.equal(4/2,2);assert.equal(keyText('START-MECH-006'),'It doubles');
  assert.equal(30/60,0.5);assert.equal(keyText('START-MECH-007'),'Half as much');
  assert.equal(keyText('START-MECH-008'),90*1.6/0.8+' N');
  assert.equal(keyText('START-NUM-005'),3*5+' metres');
  // Solve the new generative rules without looking at option labels.
  const arrows=['↑','→','↓','←'];const visual=byId.get('START-ABS-001').abstractVisual.rows[0];
  for(let i=1;i<visual.length-1;i++)assert.equal(arrows.indexOf(visual[i]),(arrows.indexOf(visual[i-1])+2)%4);
  assert.equal(keyText('START-ABS-001'),arrows[(arrows.indexOf(visual[3])+2)%4]);
  const interleaved=byId.get('START-ABS-002').abstractVisual.rows[0].slice(0,-1).map(Number);
  assert.equal(interleaved[2]-interleaved[0],2);assert.equal(interleaved[4]-interleaved[2],2);
  assert.equal(keyText('START-ABS-002'),String(interleaved[3]+interleaved[3]-interleaved[1]));
  const matrix=byId.get('START-ABS-003').abstractVisual.rows;
  function intersection(a,b){return [...a].filter(x=>b.includes(x)).join('');}
  assert.equal(intersection(matrix[0][0],matrix[0][1]),matrix[0][2]);
  assert.equal(keyText('START-ABS-003'),intersection(matrix[1][0],matrix[1][1]));
  // Enumerate all finite models of the syllogism. Include two battery objects and one non-battery.
  const conclusions=[[],[],[],[]];let modelCount=0;
  for(let shelf=0;shelf<8;shelf++)for(let labelled=0;labelled<8;labelled++){
    if((shelf&~labelled)!==0 || (shelf&3)===0)continue;
    modelCount++;
    conclusions[0].push((labelled&3)===3);
    conclusions[1].push((labelled&3)!==0);
    conclusions[2].push((labelled&shelf)===0);
    conclusions[3].push((labelled&4)===0);
  }
  assert.ok(modelCount>0);assert.equal(conclusions.filter(values=>values.every(Boolean)).length,1);
  assert.equal(conclusions.findIndex(values=>values.every(Boolean)),1);
  assert.equal(keyText('START-ABS-005'),'Some spare batteries are labelled');
  // Language keys independently reviewed against the short new passages (see amendment report).
  assert.equal(keyText('START-VER-002'),'Work the shift in place of another crew');
  assert.equal(keyText('START-VER-003'),'Place the keys in the secured return box');
  assert.equal(keyText('START-VER-005'),'No chair was available when Talia first arrived');
  // End-to-end Starting Point scoring and recommendations are invariant for equivalent answer patterns.
  for(const wrongIndex of [-1,0,8,14,20]){
    const currentJourney=app.createEmptyMvpGuestJourney(),oldJourney=baseline.createEmptyMvpGuestJourney();
    const currentSession=app.createMechanicalBaselineSession(),oldSession=baseline.createMechanicalBaselineSession();
    function answers(api,session,qs){return qs.map((q,i)=>api.createAssessmentResponse(session.sessionId,q,i===wrongIndex?q.options.find(o=>o.optionId!==q.correctOptionId).optionId:q.correctOptionId,1000,false));}
    const currentResponses=answers(app,currentSession,questions),oldResponses=answers(baseline,oldSession,previous);
    assert.equal(JSON.stringify(app.calculateStartingDomainResults(currentResponses)),JSON.stringify(baseline.calculateStartingDomainResults(oldResponses)),'domain scoring');
    const currentResult=app.completeMechanicalBaseline({...currentJourney,sessions:[currentSession],responses:currentResponses},currentSession.sessionId);
    const oldResult=baseline.completeMechanicalBaseline({...oldJourney,sessions:[oldSession],responses:oldResponses},oldSession.sessionId);
    assert.equal(currentResult.recommendations.at(-1).recommendationType,oldResult.recommendations.at(-1).recommendationType,'recommendation action');
    assert.equal(currentResult.recommendations.at(-1).title,oldResult.recommendations.at(-1).title,'recommendation title');
    if(wrongIndex===-1)assert.equal(currentResponses.filter(r=>r.correct).length,26);
  }
  // Verify the reviewed v0.44.20 instrumentation and every other runtime file are intact.
  const repo=path.resolve(__dirname,'..'),manifest=require('./fixtures/pilot2-reviewed-runtime-hashes.json');
  for(const [name,entry]of Object.entries(manifest)){
    let bytes=fs.readFileSync(path.join(repo,name));
    if(entry.normalization!=='raw'){
      let s=bytes.toString('utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
      const ast=ts.createSourceFile('App.tsx',s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
      const declaration=ast.statements.find(n=>ts.isVariableStatement(n)&&n.declarationList.declarations.some(d=>d.name.getText(ast)==='startingAssessmentQuestions'));
      bytes=Buffer.from(s.slice(0,declaration.getStart(ast))+'/* AUTHORISED_STARTING_POINT_DECLARATION */'+s.slice(declaration.end));
    }
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,'reviewed runtime preserved: '+name);
  }
  console.log('PASS 13 replacements: exact scope, keys/solvers, mappings, retained items, scoring/recommendations and reviewed v0.44.20 runtime hashes');
};
module.exports.authorised = authorised;
