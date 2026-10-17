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
const orbit = { yaw: 0.32, pitch: 0.62, radius: 12.5 };
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
function feather(parent, material, baseX, baseZ, tipX, tipZ, width, y=0) {
  const dx=tipX-baseX, dz=tipZ-baseZ;
  const length=Math.hypot(dx,dz);
  const px=-dz/length*width, pz=dx/length*width;
  const shape=new THREE.Shape();
  shape.moveTo(baseX-px*.38,baseZ-pz*.38);
  shape.quadraticCurveTo(baseX+dx*.48-px,baseZ+dz*.48-pz,tipX,tipZ);
  shape.quadraticCurveTo(baseX+dx*.48+px,baseZ+dz*.48+pz,baseX+px*.38,baseZ+pz*.38);
  shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1,curveSegments:6});
  geometry.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.y=y;
  mesh.castShadow=true;
  parent.add(mesh);
  return mesh;
}
function wingPanel(parent, material) {
  const shape=new THREE.Shape();
  shape.moveTo(-.03,.21);
  shape.bezierCurveTo(.44,.39,1.03,.32,1.38,.27);
  shape.bezierCurveTo(1.75,.29,2.08,.52,2.23,.43);
  shape.lineTo(2.36,.14);
  shape.bezierCurveTo(1.92,-.14,1.63,-.37,1.28,-.43);
  shape.bezierCurveTo(.79,-.54,.29,-.37,-.05,-.12);
  shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,curveSegments:8});
  geometry.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(geometry,material);
  mesh.castShadow=true;
  parent.add(mesh);
}
function makeBird(kind='eagle') {
  const eagle = kind === 'eagle';
  const bodyMat = eagle ? mats.eagleBody : mats.flockBody;
  const wingMat = eagle ? mats.eagleWing : mats.flockWing;
  const featherMat = eagle ? mats.eagleFeather : mats.flockFeather;
  const chestMat = eagle ? mats.eagleChest : mats.flockChest;
  const group = new THREE.Group();
  const body = new THREE.Group();
  if(eagle) body.scale.z=.7;
  group.add(body);

  ellipsoid(body, bodyMat, [0,0,0], [.36,.29,.76]);
  ellipsoid(body, chestMat, [0,-.13,.29], [.3,.21,.41]);
  ellipsoid(body, eagle ? mats.eagleGold : bodyMat, [0,.14,.57], [.22,.2,.29]);
  ellipsoid(body, bodyMat, [0,.19,.78], [.2,.19,.23]);
  if (eagle) {
    for (let i=-2;i<=2;i++) feather(body,mats.eagleGold,i*.08,.54,i*.1,.19,.055,.28);
  }
  const bill = new THREE.Mesh(new THREE.ConeGeometry(eagle?.09:.07,eagle?.25:.2,5),mats.beak);
  bill.rotation.x = Math.PI/2;
  bill.position.set(0,.12,eagle?1.02:.98);
  bill.castShadow = true;
  body.add(bill);
  if(eagle){
    const hook=new THREE.Mesh(new THREE.ConeGeometry(.037,.13,5),mats.eagleFeather);
    hook.position.set(0,.045,1.15);
    hook.rotation.z=Math.PI;
    body.add(hook);
  }
  for (const side of [-1,1]) {
    ellipsoid(body,mats.eye,[side*.18,.23,.82],[.035,.034,.035]);
    ellipsoid(body,mats.pupil,[side*.209,.23,.84],[.023,.025,.025]);
    const foot = new THREE.Group();
    foot.position.set(side*.22,-.28,-.33);
    ellipsoid(foot,mats.foot,[0,-.12,0],[.045,.16,.055],[.35,0,0]);
    for (let i=-1;i<=1;i++) ellipsoid(foot,mats.foot,[i*.055,-.23,.08],[.025,.03,.16],[0,i*.18,0]);
    body.add(foot);
  }
  for (let i=-3;i<=3;i++) feather(body,featherMat,i*.08,-.51,i*.15,-1.45+Math.abs(i)*.11,.09,-.045);

  const wings=[];
  for (const side of [-1,1]) {
    const wing = new THREE.Group();
    wing.position.set(side*.27,.08,-.06);
    wing.scale.x=side*(eagle?1.35:1.1);
    wingPanel(wing,wingMat);
    for(let i=0;i<9;i++){
      const x=.24+i*.17;
      feather(wing,featherMat,x,-.23,x+.10,-.91+Math.abs(i-4)*.055,.095,-.025);
    }
    for(let i=0;i<5;i++){
      const x=1.42+i*.17;
      feather(wing,featherMat,x,.04,2.36+i*.075,-.63+i*.17,.095,-.012);
    }
    for(let i=0;i<6;i++) feather(wing,eagle?mats.eagleGold:mats.flockChest,.14+i*.24,.02,.43+i*.23,-.22,.055,.09);
    body.add(wing);
    wings.push({wing,side});
  }
  if (!eagle) group.scale.setScalar(.48);
  group.userData.wings=wings;
  group.userData.animate=(phase,amplitude=1)=>{
    for (const {wing} of wings) wing.rotation.z=Math.sin(phase)*.34*amplitude;
    body.rotation.y=Math.sin(phase*.45)*.015;
  };
  return group;
}

const flightBird=makeBird('eagle');
flightBird.scale.setScalar(1.3);
flightBird.rotation.y=-.12;
scene.add(flightBird);
const flockGroup=new THREE.Group();
scene.add(flockGroup);
flockGroup.visible=false;

const state={
  mode:'flight',
  flight:{updraft:0.5,startHeight:100,altitude:100,distance:0,running:true,time:0},
  flock:{size:16,separation:1.4,alignment:1,cohesion:.8,running:true,time:0}
};
// Golden eagle reference values: Chatterjee et al. (2007) Table 1 gives a
// modelled cruise speed of 16 m/s; Garstang et al. (2022) use a conservative
// best-glide sink rate of 0.75 m/s for straight, non-flapping flight.
const EAGLE_CRUISE_MPS=16;
const EAGLE_SINK_MPS=0.75;
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
  // The chosen rising-air speed is a scenario input, not a field measurement.
  // At the reference best-glide condition: ground-relative climb = air rise - sink.
  const verticalSpeed=f.updraft-EAGLE_SINK_MPS;
  f.altitude=Math.max(0,f.altitude+verticalSpeed*dt);
  f.distance+=EAGLE_CRUISE_MPS*dt;
  if(f.altitude===0){f.running=false;$('#flightToggle').textContent='Restart flight'}
  // Scene height is schematic. The metre values above drive the readouts.
  flightBird.position.set(Math.sin(f.time*.38)*.18,2.9+Math.min(2.2,(f.altitude-f.startHeight)/90),Math.sin(f.time*.24)*.14);
  flightBird.rotation.z=Math.sin(f.time*.7)*.035;
  flightBird.rotation.x=-Math.sign(verticalSpeed)*.025;
  flightBird.userData.animate(f.time*1.2,.08);
  updateFlightReadout();
}
function updateFlightReadout(){
  const f=state.flight;
  const verticalSpeed=f.updraft-EAGLE_SINK_MPS;
  $('#altitudeValue').textContent=`${Math.round(f.altitude)} m`;
  $('#flightModeValue').textContent=verticalSpeed>.01?'Soaring':verticalSpeed<-.01?'Gliding':'Level';
  $('#trendValue').textContent=`${verticalSpeed>=0?'+':''}${verticalSpeed.toFixed(2)} m/s`;
  $('#distanceValue').textContent=`${(f.distance/1000).toFixed(2)} km`;
  $('#elapsedValue').textContent=`${Math.floor(f.time)} s`;
  const afterMinute=Math.max(0,f.startHeight+verticalSpeed*60);
  $('#predictionValue').textContent=`${Math.round(afterMinute)} m`;
  $('#scenarioMode').textContent=verticalSpeed>.01?'Rising air lifts the eagle faster than it sinks.':verticalSpeed<-.01?'The eagle loses height while it glides.':'Rising air exactly balances the assumed sink rate.';
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
    $('#spacingValue').textContent=`${(spacing/agents.length).toFixed(1)} units`;
    $('#speedValue').textContent=`${(speed/agents.length).toFixed(1)} units/s`;
  }
}

$('#updraft').addEventListener('input',event=>{const f=state.flight;f.updraft=Number(event.target.value);f.altitude=f.startHeight;f.distance=0;f.time=0;f.running=true;$('#flightToggle').textContent='Pause flight';$('#updraftOutput').textContent=`${f.updraft.toFixed(2)} m/s`;updateFlightReadout()});
$('#startHeight').addEventListener('input',event=>{const value=Number(event.target.value);state.flight.startHeight=value;state.flight.altitude=value;state.flight.distance=0;state.flight.time=0;state.flight.running=true;$('#startHeightOutput').textContent=`${value} m`;$('#flightToggle').textContent='Pause flight';updateFlightReadout()});
const flockInputs=[['separation','separationOutput'],['alignment','alignmentOutput'],['cohesion','cohesionOutput']];
for(const [id,output] of flockInputs){$("#"+id).addEventListener('input',event=>{state.flock[id]=Number(event.target.value);$("#"+output).textContent=Number(event.target.value).toFixed(1)})}
$('#flockSize').addEventListener('input',event=>{$('#flockSizeOutput').textContent=event.target.value});
$('#flockSize').addEventListener('change',event=>{state.flock.size=Number(event.target.value);buildFlock(state.flock.size)});

$('#flightToggle').addEventListener('click',()=>{if(state.flight.altitude===0){state.flight.altitude=state.flight.startHeight;state.flight.distance=0;state.flight.time=0}state.flight.running=!state.flight.running;$('#flightToggle').textContent=state.flight.running?'Pause flight':'Resume flight';updateFlightReadout()});
$('#flockToggle').addEventListener('click',()=>{state.flock.running=!state.flock.running;$('#flockToggle').textContent=state.flock.running?'Pause flock':'Resume flock'});
$('#flightReset').addEventListener('click',()=>{
  Object.assign(state.flight,{updraft:0.5,startHeight:100,altitude:100,distance:0,running:true,time:0});
  $('#updraft').value='0.5';$('#startHeight').value='100';
  $('#updraftOutput').textContent='0.50 m/s';$('#startHeightOutput').textContent='100 m';$('#flightToggle').textContent='Pause flight';updateFlightReadout();
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
  $('#flightExtra').hidden=!flight;
  $('#labTitle').textContent=flight?'When can a golden eagle soar?':'How does a flock move together?';
  $('#stageLabel').textContent=flight?'GOLDEN EAGLE · SOARING MODEL':'MODEL BIRDS · FLOCKING RULES';
  $('#flightTab').setAttribute('aria-selected',String(flight));$('#flockTab').setAttribute('aria-selected',String(!flight));
  $('#flightTab').tabIndex=flight?0:-1;$('#flockTab').tabIndex=flight?-1:0;
}
$('#flightTab').addEventListener('click',()=>setMode('flight'));
$('#flockTab').addEventListener('click',()=>setMode('flock'));
for(const tab of [$('#flightTab'),$('#flockTab')])tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=state.mode==='flight'?'flock':'flight';setMode(next);$(next==='flight'?'#flightTab':'#flockTab').focus()}});
setMode('flight');
updateFlightReadout();

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
