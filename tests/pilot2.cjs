/* Run with: node tests/pilot2.cjs. Uses existing TypeScript; no test dependencies. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require('typescript');
const repo = path.resolve(__dirname, '..');
let currentRenderer;
let clock = 10000;
const storage = new Map();
const hooks = {
  useState(initial) { const r=currentRenderer, i=r.cursor++; if (!(i in r.slots)) r.slots[i]=typeof initial==='function'?initial():initial; return [r.slots[i], value=>{const next=typeof value==='function'?value(r.slots[i]):value;if(!Object.is(next,r.slots[i])){r.slots[i]=next;r.dirty=true;}}]; },
  useRef(initial) { const r=currentRenderer, i=r.cursor++; if(!(i in r.slots))r.slots[i]={current:initial};return r.slots[i]; },
  useEffect(effect,deps) { const r=currentRenderer,i=r.cursor++,old=r.slots[i];if(!old||!deps||deps.some((v,j)=>!Object.is(v,old[j]))){r.slots[i]=deps;r.effects.push(effect);} },
  useMemo(fn) { return fn(); },
};
const names = ['HydraulicIndependentPracticeQuestionScreen','GearIndependentPracticeQuestionScreen','PulleyPracticeQuestionScreen','LeverPracticeQuestionScreen','NumericalPracticeQuestionScreen','AbstractLogicalPracticeQuestionScreen','VerbalPracticeQuestionScreen','GearAssessmentQuestionScreen','MixedMechanicalAssessmentQuestionScreen','GuidedHydraulicQuestionScreen','GuidedGearQuestionScreen','createVerbalIndependentStrongDemoJourney','createEmptyMvpGuestJourney','saveMvpGuestJourney','loadMvpGuestJourney','createAssessmentResponse','AnswerReviewScreen','calculateVerbalSummary','createMechanicalBaselineSession','calculateStartingDomainResults','calculateStartingAssessmentEvidence','completeMechanicalBaseline'];
const banks = ['hydraulicIndependentPracticeQuestions','gearIndependentPracticeQuestions','pulleyIndependentPracticeQuestions','leverIndependentPracticeQuestions','numericalIndependentPracticeQuestions','abstractLogicalIndependentPracticeQuestions','verbalIndependentPracticeQuestions','gearAssessmentQuestions','pulleyAssessmentQuestions','leverAssessmentQuestions','numericalAssessmentQuestions','abstractLogicalAssessmentQuestions','verbalAssessmentQuestions','mixedMechanicalAssessmentQuestions','guidedHydraulicPracticeQuestions','guidedGearPracticeQuestions','guidedPulleyPracticeQuestions','guidedLeverPracticeQuestions','guidedNumericalPracticeQuestions','guidedAbstractLogicalPracticeQuestions','guidedVerbalPracticeQuestions','startingAssessmentQuestions'];
function loadApp(baseline=false) {
  const cache = {};
  function load(name) {
    if(cache[name])return cache[name].exports;
    const m={exports:{}};cache[name]=m;
    let source = name==='App'&&baseline ? cp.execFileSync('git',['show','2065282637d1407a1b41f16b6b73aa33884b5b72:src/App.tsx'],{cwd:repo,encoding:'utf8',maxBuffer:5e6}) : fs.readFileSync(path.join(repo,'src',name+(name==='App'?'.tsx':'.ts')),'utf8');
    if(name==='App')source+='\nexport const testExports={'+[...names,...banks].join(',')+'};';
    source=source.replaceAll('import.meta.env','({})');
    const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
    function req(id){if(id==='react')return hooks;if(id==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};if(id==='./accountService'||id==='./learnerSyncService')return {};if(id.startsWith('./'))return load(id.slice(2));throw Error(id);}
    class TestDate extends Date { constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;} }
    vm.runInNewContext(code,{exports:m.exports,require:req,Date:TestDate,Map,Set,console,performance:{now:()=>clock},window:{innerWidth:390,setTimeout(fn){fn();return 1;},clearTimeout(){},scrollTo(){},requestAnimationFrame(fn){fn();},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)}},document:{getElementById:()=>null},crypto:require('node:crypto').webcrypto,setTimeout,Blob,URL});
    return m.exports;
  }
  return {app:load('App').testExports,telemetry:baseline?null:load('pilot2Telemetry')};
}
const {app,telemetry}=loadApp();
function render(component,props){const r={slots:[],cursor:0,effects:[],dirty:true,tree:null};r.update=()=>{for(let n=0;n<10;n++){r.dirty=false;r.cursor=0;r.effects=[];currentRenderer=r;r.tree=component(props);r.effects.forEach(fn=>fn());if(!r.dirty)return;}throw Error('Render loop');};r.update();return r;}
function nodes(tree){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)];}
function text(tree){if(tree===null||tree===undefined||typeof tree==='boolean')return '';if(typeof tree==='string'||typeof tree==='number')return String(tree);if(Array.isArray(tree))return tree.map(text).join(' ');return text(tree.props?.children);}
function clickOption(r,q,id){const option=q.options.find(o=>o.optionId===id);const node=nodes(r.tree).find(n=>n.type==='button'&&text(n).includes(option.text));assert.ok(node,'option '+id);assert.ok(!node.props.disabled,'option editable');node.props.onClick();r.update();}
function next(r){const button=nodes(r.tree).find(n=>typeof n.type==='function'&&n.type.name==='PrimaryButton'&&n.props.onClick);assert.ok(button,'Next exists');assert.ok(!button.props.disabled);button.props.onClick();r.update();}
const shared=[['PulleyPracticeQuestionScreen','pulley'],['LeverPracticeQuestionScreen','lever'],['NumericalPracticeQuestionScreen','numerical'],['AbstractLogicalPracticeQuestionScreen','abstractLogical'],['VerbalPracticeQuestionScreen','verbal']];
const independent=[['HydraulicIndependentPracticeQuestionScreen','hydraulic'],['GearIndependentPracticeQuestionScreen','gear'],...shared];
let assertions=0;
for(const [screen,prefix] of independent){
 const qs=app[prefix+'IndependentPracticeQuestions'],q=qs[0],calls=[];
 const props={journey:{responses:[]},sessionId:'session-test',questionIndex:0,questions:qs,stage:'independent',onAnswer:(...args)=>calls.push(args)};
 const r=render(app[screen],props),wrong=q.options.find(o=>o.optionId!==q.correctOptionId).optionId;
 clock+=300;clickOption(r,q,wrong);assert.ok(!text(r.tree).includes(q.explanation),'no first selection feedback');
 clock+=200;clickOption(r,q,q.correctOptionId);clock+=50;clickOption(r,q,q.correctOptionId);assert.ok(!text(r.tree).includes(q.explanation),'no revised selection feedback');
 clock+=450;next(r);assert.equal(calls.length,1);const response=calls[0][0];assert.equal(calls[0][2],true,'persist on first Next');assert.equal(response.firstSelectedOptionId,wrong);assert.equal(response.selectedOptionId,q.correctOptionId);assert.equal(response.correct,true);assert.equal(response.answerChangeCount,1);assert.equal(response.firstSelectionTimeMs,300);assert.equal(response.totalQuestionTimeMs,1000);assert.ok(response.finalSubmissionAt);assert.ok(text(r.tree).includes(q.explanation),'feedback after submission');
 clock+=5000;next(r);assert.equal(calls.length,2);assert.equal(calls[1][0].responseId,response.responseId);assert.equal(calls[1][0].totalQuestionTimeMs,1000,'feedback time excluded');
 // Question-key change starts a new capture.
 props.questionIndex=1;r.update();clock+=125;clickOption(r,qs[1],qs[1].correctOptionId);clock+=75;next(r);assert.equal(calls[2][0].firstSelectionTimeMs,125);assert.equal(calls[2][0].answerChangeCount,0);
 assertions++;console.log('PASS independent '+prefix);
}
const checks=[['GearAssessmentQuestionScreen','gear'],...shared,['MixedMechanicalAssessmentQuestionScreen','mixedMechanical']];
for(const [screen,prefix] of checks){const qs=app[prefix+'AssessmentQuestions'],q=qs[0],calls=[],r=render(app[screen],{journey:{responses:[]},sessionId:'check',questionIndex:0,questions:qs,stage:'assessment',onAnswer:(...a)=>calls.push(a)});const wrong=q.options.find(o=>o.optionId!==q.correctOptionId).optionId;clock+=100;clickOption(r,q,q.correctOptionId);clock+=200;clickOption(r,q,wrong);assert.ok(!text(r.tree).includes(q.explanation));clock+=100;next(r);assert.equal(calls.length,1);assert.equal(calls[0][0].firstSelectedOptionId,q.correctOptionId);assert.equal(calls[0][0].selectedOptionId,wrong);assert.equal(calls[0][0].correct,false);assert.equal(calls[0][0].answerChangeCount,1);assert.equal(calls[0][0].firstSelectionTimeMs,100);assert.equal(calls[0][0].totalQuestionTimeMs,400);assert.ok(!text(r.tree).includes(q.explanation));assertions++;console.log('PASS check '+prefix);}
for(const [screen,prefix] of [...shared,['GuidedHydraulicQuestionScreen','hydraulic'],['GuidedGearQuestionScreen','gear']]){const qs=app['guided'+prefix[0].toUpperCase()+prefix.slice(1)+'PracticeQuestions'],q=qs[0],calls=[],r=render(app[screen],{journey:{responses:[]},sessionId:'guided',questionIndex:0,questions:qs,stage:'guided',onAnswer:(...a)=>calls.push(a)});clickOption(r,q,q.correctOptionId);assert.ok(text(r.tree).includes(q.explanation));const other=q.options.find(o=>o.optionId!==q.correctOptionId);const button=nodes(r.tree).find(n=>n.type==='button'&&text(n).includes(other.text));if(button&&!button.props.disabled){button.props.onClick();r.update();}next(r);assert.equal(calls[0][0].selectedOptionId,q.correctOptionId,'Guided selection locks');assertions++;console.log('PASS guided '+prefix);}
// Exact clocks, multiple switches, repeated taps, all correctness transitions, frozen submission and legacy CSV.
for(const firstCorrect of [false,true])for(const finalCorrect of [false,true]){const c=telemetry.beginPilot2Question(1000,0),q=app.verbalAssessmentQuestions[0],wrong=q.options.find(o=>o.optionId!==q.correctOptionId).optionId;telemetry.recordPilot2Selection(c,firstCorrect?q.correctOptionId:wrong,1100,100);telemetry.recordPilot2Selection(c,finalCorrect?q.correctOptionId:wrong,1200,200);const capture=telemetry.submitPilot2Question(c,1500,500);telemetry.recordPilot2Selection(c,wrong,1900,900);assert.equal(telemetry.submitPilot2Question(c,2000,1000).totalQuestionTimeMs,500);const response={...capture,domain:q.domain,subcompetency:q.subcompetency,sessionId:'s',responseId:'r',questionId:q.questionId,selectedOptionId:finalCorrect?q.correctOptionId:wrong,correct:finalCorrect,responseTimeMs:500,answeredAt:'x',telemetryVersion:telemetry.PILOT2_TELEMETRY_VERSION};const csv=telemetry.buildPilot2Csv({guestJourneyId:'p',sessions:[{sessionId:'s',sessionType:'verbal_assessment',startedAt:'x'}],responses:[response]},[q]);assert.ok(csv.includes((firstCorrect?'correct':'incorrect')+'_to_'+(finalCorrect?'correct':'incorrect')));}
const legacy={sessionId:'old',responseId:'old-r',questionId:'old-q',selectedOptionId:'A',correct:false,responseTimeMs:999,answeredAt:'x'};assert.ok(telemetry.buildPilot2Csv({guestJourneyId:'legacy',sessions:[],responses:[legacy]},[]).includes('legacy_or_uninstrumented'));
const journey=app.createEmptyMvpGuestJourney();journey.responses.push(legacy);app.saveMvpGuestJourney(journey);assert.equal(app.loadMvpGuestJourney().responses[0].responseTimeMs,999);
const demo=app.createVerbalIndependentStrongDemoJourney();const summary=demo.practiceSummaries.find(s=>s.sessionType==='verbal_independent_practice');assert.equal(summary.correct,10);assert.equal(summary.attempted,12);assert.equal(demo.recommendations.find(r=>r.status==='active').recommendationType,'begin_verbal_assessment');
// Frozen banks and recommendation implementations must remain exactly equal to baseline.
const baseline=loadApp(true).app;
for(const bank of banks.filter(name=>name!=='startingAssessmentQuestions'))assert.equal(JSON.stringify(app[bank]),JSON.stringify(baseline[bank]),'frozen '+bank);
const source=fs.readFileSync(path.join(repo,'src/App.tsx'),'utf8'),base=cp.execFileSync('git',['show','2065282637d1407a1b41f16b6b73aa33884b5b72:src/App.tsx'],{cwd:repo,encoding:'utf8',maxBuffer:5e6});
function declarations(s){const ast=ts.createSourceFile('App.tsx',s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);return new Map(ast.statements.filter(n=>ts.isFunctionDeclaration(n)&&n.name).map(n=>[n.name.text,n.getText(ast).replace(/\r/g, "")]));}
const before=declarations(base),after=declarations(source);for(const[n,body]of before)if(/^(complete|calculate|weakest)/.test(n))assert.equal(after.get(n),body,'scoring/recommendation '+n);
console.log('PASS legacy persistence, CSV transitions, Tester Tool, all frozen banks and scoring/recommendation functions');
console.log('PASS '+assertions+' screen/stage scenarios plus telemetry and regression assertions');



// Protect every existing top-level authored data/module constant except the release label.
for (const [label, content] of [['baseline',base],['current',source]]) {
  const ast=ts.createSourceFile('App.tsx',content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const vars=new Map(ast.statements.filter(ts.isVariableStatement).map(n=>[n.declarationList.declarations.map(d=>d.name.getText(ast)).join(','),n.getText(ast).replace(/\r/g,'')]));
  if(label==='baseline')globalThis.baselineVars=vars;else for(const[n,v]of globalThis.baselineVars)if(n!=='BUILD_LABEL'&&n!=='startingAssessmentQuestions')assert.equal(vars.get(n),v,'authored data constant '+n);
}
const changes=telemetry.beginPilot2Question(1000,0);for(const [i,option] of ['A','B','B','C','A'].entries())telemetry.recordPilot2Selection(changes,option,1100+i*100,100+i*100);assert.equal(changes.answerChangeCount,3);assert.equal(changes.firstOptionId,'A');
// Existing journey JSON union preserves optional fields without a schema migration.
const mergeExports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(repo,'src/learnerSyncService.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:mergeExports,require:()=>({supabase:null}),Date,Map,JSON});
const oldJourney={version:'mvp_v1',updatedAt:'2020',sessions:[],responses:[legacy]};const newJourney={...oldJourney,updatedAt:'2026',responses:[{...legacy,responseId:'pilot-response',questionPresentedAt:'presented',firstSelectedOptionId:'A',answerChangeCount:2}]};const merged=mergeExports.mergeLearnerJourneys(newJourney,oldJourney);assert.equal(merged.responses.length,2);assert.equal(merged.responses.find(r=>r.responseId==='pilot-response').answerChangeCount,2);
console.log('PASS all authored constants, multiple answer changes and backward-compatible journey merge');

// Test actual parent handlers: submission persists without advancing; Continue does not duplicate it.
const ast=ts.createSourceFile('App.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const handlerNames=['handleHydraulicIndependentAnswer','handleGearIndependentPracticeAnswer','handlePulleyIndependentPracticeAnswer','handleLeverIndependentPracticeAnswer','handleNumericalIndependentAnswer','handleAbstractLogicalIndependentAnswer','handleVerbalIndependentAnswer'];
const handlerNodes=new Map();function visit(n){if(ts.isFunctionDeclaration(n)&&n.name&&handlerNames.includes(n.name.text))handlerNodes.set(n.name.text,n.getText(ast));ts.forEachChild(n,visit);}visit(ast);
for(const name of handlerNames){const body=handlerNodes.get(name);for(const final of [false,true]){const context={hydraulicIndependentPracticeQuestions:app.hydraulicIndependentPracticeQuestions,journey:{responses:[]},activeSessionId:'s',now:()=>'',index:0,screen:'question',exports:{}};context.updateJourney=j=>context.journey=j;context.setActiveQuestionIndex=v=>context.index=typeof v==='function'?v(context.index):v;context.setScreen=v=>context.screen=v;context.setActiveSessionId=()=>{};for(const match of body.matchAll(/\b(complete\w+)\(/g))context[match[1]]=j=>({...j,completed:true});vm.createContext(context);vm.runInContext(ts.transpileModule(body+'\nexports.handler='+name,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,context);const response={responseId:'r',sessionId:'s',questionId:'q',correct:true};context.exports.handler(response,false,true);assert.equal(context.journey.responses.length,1);assert.equal(context.index,0);assert.equal(context.screen,'question');context.exports.handler(response,final);assert.equal(context.journey.responses.length,1);if(final)assert.equal(context.journey.completed,true);else assert.equal(context.index,1);}console.log('PASS parent handler '+name);}
const many={...oldJourney,responses:Array.from({length:24},(_,i)=>({...legacy,responseId:'r'+i,answerChangeCount:i}))};const union=mergeExports.mergeLearnerJourneys(many,many);assert.equal(union.responses.length,24);assert.equal(union.responses[23].answerChangeCount,23);console.log('PASS idempotent same-session 24-response sync');


require("./starting-point-amendment.cjs")(app, baseline);
