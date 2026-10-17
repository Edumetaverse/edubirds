import * as THREE from './assets/vendor/three.module.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#simCanvas');
const stage = $('#simStage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (error) {
  $('#simError').hidden = false;
  throw error;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfe6e9);
scene.fog = new THREE.Fog(0xcfe6e9, 20, 48);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
const orbit = { yaw: 0.48, pitch: 0.25, radius: 14 };
function updateCamera() {
  const target = new THREE.Vector3(0, 2.7, 0);
  camera.position.set(
    target.x + orbit.radius * Math.sin(orbit.yaw) * Math.cos(orbit.pitch),
    target.y + orbit.radius * Math.sin(orbit.pitch),
    target.z + orbit.radius * Math.cos(orbit.yaw) * Math.cos(orbit.pitch)
  );
  camera.lookAt(target);
}
updateCamera();

scene.add(new THREE.HemisphereLight(0xe7f4ff, 0x8d9e68, 2.1));
const sun = new THREE.DirectionalLight(0xffefd1, 3.4);
sun.position.set(-6, 13, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -16;
sun.shadow.camera.right = 16;
sun.shadow.camera.top = 16;
sun.shadow.camera.bottom = -16;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xb3dce3, 1.2);
fill.position.set(7, 5, -7);
scene.add(fill);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshStandardMaterial({ color: 0x9bbd8f, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.65;
ground.receiveShadow = true;
scene.add(ground);

const hillMat = new THREE.MeshStandardMaterial({ color: 0x79a893, roughness: 1, flatShading: true });
for (const [x, z, r, h] of [[-11,-12,6,4],[2,-19,8,5],[14,-13,7,4],[-17,2,7,3]]) {
  const hill = new THREE.Mesh(new THREE.ConeGeometry(r,h,7), hillMat);
  hill.position.set(x,h/2-0.7,z);
  hill.receiveShadow = true;
  scene.add(hill);
}

const cloudMat = new THREE.MeshStandardMaterial({ color: 0xfafdf7, transparent:true, opacity:.68, roughness:1, depthWrite:false });
const clouds = [];
for (const [x,y,z,s] of [[-6,7,-9,1],[5,8,-11,1.3],[11,6,-16,.9]]) {
  const group = new THREE.Group();
  for (const [cx,cy,cz,scale] of [[0,0,0,1],[-1,.05,.1,.75],[.9,.12,-.1,.88]]) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1,12,8),cloudMat);
    puff.scale.set(1.5*scale,.6*scale,.85*scale);
    puff.position.set(cx,cy,cz);
    group.add(puff);
  }
  group.position.set(x,y,z);
  group.scale.setScalar(s);
  scene.add(group);
  clouds.push(group);
}

const mats = {
  eagleBody: new THREE.MeshStandardMaterial({color:0x5a3726,roughness:.88,flatShading:true}),
  eagleWing: new THREE.MeshStandardMaterial({color:0x69442e,roughness:.88,flatShading:true}),
  eagleFeather: new THREE.MeshStandardMaterial({color:0x3d2c27,roughness:.9,flatShading:true}),
  eagleGold: new THREE.MeshStandardMaterial({color:0xd0a05f,roughness:.86,flatShading:true}),
  eagleChest: new THREE.MeshStandardMaterial({color:0x90613d,roughness:.9,flatShading:true}),
  beak: new THREE.MeshStandardMaterial({color:0xdfa64a,roughness:.55,metalness:.06,flatShading:true}),
  foot: new THREE.MeshStandardMaterial({color:0xe0b15d,roughness:.75,flatShading:true}),
  eye: new THREE.MeshStandardMaterial({color:0xffd466,roughness:.3}),
  pupil: new THREE.MeshStandardMaterial({color:0x111719,roughness:.12,metalness:.15}),
  flockBody: new THREE.MeshStandardMaterial({color:0x287c85,roughness:.8,flatShading:true}),
  flockWing: new THREE.MeshStandardMaterial({color:0x1b5e6b,roughness:.82,flatShading:true}),
  flockChest: new THREE.MeshStandardMaterial({color:0xd9be80,roughness:.9,flatShading:true}),
  flockFeather: new THREE.MeshStandardMaterial({color:0x123d54,roughness:.83,flatShading:true})
};
const sphere = new THREE.SphereGeometry(1,14,10);
function ellipsoid(parent, material, position, scale, rotation) {
  const mesh = new THREE.Mesh(sphere, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function makeBird(kind='eagle') {
  const eagle = kind === 'eagle';
  const bodyMat = eagle ? mats.eagleBody : mats.flockBody;
  const wingMat = eagle ? mats.eagleWing : mats.flockWing;
  const featherMat = eagle ? mats.eagleFeather : mats.flockFeather;
  const chestMat = eagle ? mats.eagleChest : mats.flockChest;
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  ellipsoid(body, bodyMat, [0,0,0], [.46,.33,.84]);
  ellipsoid(body, chestMat, [0,-.18,.25], [.36,.23,.53]);
  ellipsoid(body, eagle ? mats.eagleGold : bodyMat, [0,.21,.57], [.27,.25,.33]);
  ellipsoid(body, eagle ? mats.eagleBody : bodyMat, [0,.29,.75], [.24,.21,.25]);
  if (eagle) {
    for (let i=-2;i<=2;i++) ellipsoid(body,mats.eagleGold,[i*.09,.2,.49-i*.015],[.055,.1,.23],[.15,0,i*.11]);
  }
  const bill = new THREE.Mesh(new THREE.ConeGeometry(eagle?.13:.095,eagle?.38:.31,5),mats.beak);
  bill.rotation.x = Math.PI/2;
  bill.position.set(0,.21,eagle?1.1:1.08);
  bill.castShadow = true;
  body.add(bill);
  for (const side of [-1,1]) {
    ellipsoid(body,mats.eye,[side*.205,.36,.83],[.06,.06,.055]);
    ellipsoid(body,mats.pupil,[side*.246,.365,.85],[.034,.037,.035]);
    const foot = new THREE.Group();
    foot.position.set(side*.22,-.28,-.33);
    ellipsoid(foot,mats.foot,[0,-.12,0],[.045,.16,.055],[.35,0,0]);
    for (let i=-1;i<=1;i++) ellipsoid(foot,mats.foot,[i*.055,-.23,.08],[.025,.03,.16],[0,i*.18,0]);
    body.add(foot);
  }
  for (let i=-2;i<=2;i++) ellipsoid(body,featherMat,[i*.095,-.035,-.87],[.09,.045,.51],[0,i*.13,0]);

  const wings=[];
  for (const side of [-1,1]) {
    const wing = new THREE.Group();
    wing.position.set(side*.36,.08,-.08);
    wing.scale.x=side;
    ellipsoid(wing,wingMat,[.61,0,-.04],[.78,.095,.29],[0,-.13,0]);
    for (let i=0;i<6;i++) {
      ellipsoid(wing,featherMat,[.83+i*.16,-.012,-.22-i*.025],[.33-i*.015,.037,.105],[0,-.1-i*.045,0]);
    }
    for (let i=0;i<4;i++) {
      ellipsoid(wing,wingMat,[.38+i*.23,.025,.08],[.25,.037,.1],[0,-.05,0]);
    }
    body.add(wing);
    wings.push({wing,side});
  }
  if (!eagle) group.scale.setScalar(.64);
  group.userData.wings=wings;
  group.userData.animate=(phase,amplitude=1)=>{
    for (const {wing} of wings) wing.rotation.z=Math.sin(phase)*.52*amplitude;
    body.rotation.y=Math.sin(phase*.45)*.02;
  };
  return group;
}

const flightBird=makeBird('eagle');
flightBird.scale.setScalar(2.75);
flightBird.rotation.y=-.12;
scene.add(flightBird);
const flockGroup=new THREE.Group();
scene.add(flockGroup);
flockGroup.visible=false;

const state={
  mode:'flight',
  flight:{wingbeat:2.8,spread:1,updraft:2,altitude:30,velocity:0,running:true,time:0},
  flock:{size:16,separation:1.4,alignment:1,cohesion:.8,running:true,time:0}
};
let agents=[];
function randomRange(a,b){return a+Math.random()*(b-a)}
function buildFlock(count){
  for (const agent of agents) flockGroup.remove(agent.model);
  agents=[];
  for (let i=0;i<count;i++) {
    const model=makeBird('small');
    const tint=[0xffffff,0xd6f1ee,0xe3e5bb,0xc5dce4][i%4];
    model.traverse(object=>{if(object.isMesh && object.material===mats.flockBody){object.material=mats.flockBody.clone();object.material.color.multiplyScalar(i%4===0?1:.8);object.material.color.multiply(new THREE.Color(tint))}});
    const position=new THREE.Vector3(randomRange(-4,4),randomRange(1.5,5.2),randomRange(-3,3));
    const velocity=new THREE.Vector3(randomRange(-1,1),randomRange(-.3,.3),randomRange(-1,1)).normalize().multiplyScalar(randomRange(1.3,2.2));
    model.position.copy(position);
    model.rotation.y=Math.atan2(velocity.x,velocity.z);
    flockGroup.add(model);
    agents.push({model,position,velocity,phase:Math.random()*Math.PI*2});
  }
  $('#birdCountValue').textContent=String(count);
}
buildFlock(state.flock.size);

function updateFlight(dt){
  const f=state.flight;
  if (!f.running) return;
  f.time+=dt;
  const lift=f.wingbeat*.23*f.spread+f.updraft*.17+f.spread*.22;
  const acceleration=lift-.98-f.velocity*.19;
  f.velocity=THREE.MathUtils.clamp(f.velocity+acceleration*dt*2.2,-3.5,3.5);
  f.altitude=THREE.MathUtils.clamp(f.altitude+f.velocity*dt*1.3,5,75);
  if(f.altitude===5&&f.velocity<0)f.velocity=0;
  if(f.altitude===75&&f.velocity>0)f.velocity=0;
  flightBird.position.set(Math.sin(f.time*.55)*.22,1.1+f.altitude/18,Math.sin(f.time*.35)*.2);
  flightBird.rotation.z=Math.sin(f.time*.7)*.035;
  flightBird.rotation.x=-THREE.MathUtils.clamp(f.velocity*.045,-.16,.16);
  for(const {wing,side} of flightBird.userData.wings)wing.scale.x=side*f.spread;
  flightBird.userData.animate(f.time*Math.PI*2*f.wingbeat,f.wingbeat<.1?.03:Math.min(1.2,.35+f.wingbeat*.18));
  $('#altitudeValue').textContent=`${Math.round(f.altitude)} m`;
  $('#flightModeValue').textContent=f.wingbeat<.1?(f.updraft>3?'Soaring':'Gliding'):'Flapping';
  $('#trendValue').textContent=f.velocity>.08?'Rising':f.velocity<-.08?'Falling':'Steady';
}
function updateFlock(dt){
  const f=state.flock;
  if(!f.running)return;
  f.time+=dt;
  const next=[];
  for(let i=0;i<agents.length;i++){
    const bird=agents[i];
    const separation=new THREE.Vector3(),alignment=new THREE.Vector3(),cohesion=new THREE.Vector3();
    let near=0;
    for(let j=0;j<agents.length;j++){
      if(i===j)continue;
      const other=agents[j];
      const delta=bird.position.clone().sub(other.position);
      const distance=delta.length();
      if(distance<3.5&&distance>.001){
        near++;
        separation.addScaledVector(delta,1/(distance*distance));
        alignment.add(other.velocity);
        cohesion.add(other.position);
      }
    }
    const accel=new THREE.Vector3();
    if(near){
      separation.divideScalar(near).normalize().multiplyScalar(f.separation*2.0);
      alignment.divideScalar(near).sub(bird.velocity).multiplyScalar(f.alignment*.55);
      cohesion.divideScalar(near).sub(bird.position).multiplyScalar(f.cohesion*.35);
      accel.add(separation).add(alignment).add(cohesion);
    }
    const home=new THREE.Vector3(-bird.position.x*.16,(3.0-bird.position.y)*.6,-bird.position.z*.18);
    accel.add(home);
    const velocity=bird.velocity.clone().addScaledVector(accel,dt).clampLength(.8,2.8);
    const position=bird.position.clone().addScaledVector(velocity,dt);
    next.push({position,velocity});
  }
  agents.forEach((bird,i)=>{
    bird.position.copy(next[i].position);
    bird.velocity.copy(next[i].velocity);
    bird.model.position.copy(bird.position);
    bird.model.rotation.y=Math.atan2(bird.velocity.x,bird.velocity.z);
    bird.model.rotation.x=-Math.atan2(bird.velocity.y,Math.hypot(bird.velocity.x,bird.velocity.z))*.6;
    bird.model.userData.animate(f.time*9+bird.phase,.5);
  });
  if(Math.floor(f.time*2)!==Math.floor((f.time-dt)*2)){
    let spacing=0,speed=0;
    for(let i=0;i<agents.length;i++){
      let nearest=Infinity;
      for(let j=0;j<agents.length;j++)if(i!==j)nearest=Math.min(nearest,agents[i].position.distanceTo(agents[j].position));
      spacing+=nearest;
      speed+=agents[i].velocity.length();
    }
    $('#spacingValue').textContent=`${(spacing/agents.length).toFixed(1)} m`;
    $('#speedValue').textContent=`${(speed/agents.length).toFixed(1)} m/s`;
  }
}

const flightInputs=[['wingbeat',v=>v,'wingbeatOutput',v=>`${Number(v).toFixed(1)} / s`],['spread',v=>v/100,'spreadOutput',v=>`${v}%`],['updraft',v=>v,'updraftOutput',v=>`${Number(v).toFixed(1)} / 6`]];
for(const [id,convert,output,format] of flightInputs){$("#"+id).addEventListener('input',event=>{state.flight[id]=Number(convert(event.target.value));$("#"+output).textContent=format(event.target.value)})}
const flockInputs=[['separation','separationOutput'],['alignment','alignmentOutput'],['cohesion','cohesionOutput']];
for(const [id,output] of flockInputs){$("#"+id).addEventListener('input',event=>{state.flock[id]=Number(event.target.value);$("#"+output).textContent=Number(event.target.value).toFixed(1)})}
$('#flockSize').addEventListener('input',event=>{$('#flockSizeOutput').textContent=event.target.value});
$('#flockSize').addEventListener('change',event=>{state.flock.size=Number(event.target.value);buildFlock(state.flock.size)});

$('#flightToggle').addEventListener('click',()=>{state.flight.running=!state.flight.running;$('#flightToggle').textContent=state.flight.running?'Pause flight':'Resume flight'});
$('#flockToggle').addEventListener('click',()=>{state.flock.running=!state.flock.running;$('#flockToggle').textContent=state.flock.running?'Pause flock':'Resume flock'});
$('#flightReset').addEventListener('click',()=>{
  Object.assign(state.flight,{wingbeat:2.8,spread:1,updraft:2,altitude:30,velocity:0,running:true,time:0});
  $('#wingbeat').value='2.8';$('#spread').value='100';$('#updraft').value='2';
  $('#wingbeatOutput').textContent='2.8 / s';$('#spreadOutput').textContent='100%';$('#updraftOutput').textContent='2.0 / 6';$('#flightToggle').textContent='Pause flight';
});
$('#flockReset').addEventListener('click',()=>{
  Object.assign(state.flock,{size:16,separation:1.4,alignment:1,cohesion:.8,running:true,time:0});
  $('#flockSize').value='16';$('#separation').value='1.4';$('#alignment').value='1';$('#cohesion').value='.8';
  $('#flockSizeOutput').textContent='16';$('#separationOutput').textContent='1.4';$('#alignmentOutput').textContent='1.0';$('#cohesionOutput').textContent='0.8';$('#flockToggle').textContent='Pause flock';
  buildFlock(16);
});

function setMode(mode){
  state.mode=mode;
  const flight=mode==='flight';
  flightBird.visible=flight;flockGroup.visible=!flight;
  $('#flightControls').hidden=!flight;$('#flockControls').hidden=flight;
  $('#flightReadout').hidden=!flight;$('#flockReadout').hidden=flight;
  $('#labTitle').textContent=flight?'How does a bird stay in the air?':'How does a flock move together?';
  $('#stageLabel').textContent=flight?'GOLDEN EAGLE · FLIGHT MODEL':'MODEL BIRDS · FLOCKING RULES';
  $('#flightTab').setAttribute('aria-selected',String(flight));$('#flockTab').setAttribute('aria-selected',String(!flight));
  $('#flightTab').tabIndex=flight?0:-1;$('#flockTab').tabIndex=flight?-1:0;
}
$('#flightTab').addEventListener('click',()=>setMode('flight'));
$('#flockTab').addEventListener('click',()=>setMode('flock'));
for(const tab of [$('#flightTab'),$('#flockTab')])tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=state.mode==='flight'?'flock':'flight';setMode(next);$(next==='flight'?'#flightTab':'#flockTab').focus()}});
setMode('flight');

const pointers=new Map();
let previousPinch=0;
canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});previousPinch=0});
canvas.addEventListener('pointermove',event=>{
  if(!pointers.has(event.pointerId))return;
  const before=pointers.get(event.pointerId);
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(pointers.size===1){orbit.yaw-=(event.clientX-before.x)*.008;orbit.pitch=THREE.MathUtils.clamp(orbit.pitch+(event.clientY-before.y)*.006,-.15,1.2);updateCamera()}
  else if(pointers.size===2){const [a,b]=[...pointers.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);if(previousPinch)orbit.radius=THREE.MathUtils.clamp(orbit.radius-(distance-previousPinch)*.045,7,27);previousPinch=distance;updateCamera()}
});
function releasePointer(event){pointers.delete(event.pointerId);previousPinch=0}
canvas.addEventListener('pointerup',releasePointer);canvas.addEventListener('pointercancel',releasePointer);
canvas.addEventListener('wheel',event=>{event.preventDefault();orbit.radius=THREE.MathUtils.clamp(orbit.radius+event.deltaY*.012,7,27);updateCamera()},{passive:false});

function resize(){const width=stage.clientWidth,height=stage.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);
resize();
const clock=new THREE.Clock();
function frame(){const dt=Math.min(clock.getDelta(),.05);updateFlight(dt);updateFlock(dt);clouds.forEach((cloud,i)=>{cloud.position.x+=dt*(.11+i*.025);if(cloud.position.x>18)cloud.position.x=-18});renderer.render(scene,camera);requestAnimationFrame(frame)}
frame();
