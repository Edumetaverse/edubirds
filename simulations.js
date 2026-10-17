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
const orbit = { yaw: 0.18, pitch: 0.30, radius: 9.2 };
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
const hills=[];
for (const [x, z, r, h] of [[-11,-12,6,4],[2,-19,8,5],[14,-13,7,4],[-17,2,7,3]]) {
  const hill = new THREE.Mesh(new THREE.ConeGeometry(r,h,7), hillMat);
  hill.position.set(x,h/2-0.7,z);
  hill.receiveShadow = true;
  scene.add(hill);
  hills.push(hill);
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
  shape.bezierCurveTo(.44,.39,1.03,.32,1.36,.22);
  shape.lineTo(1.38,-.29);
  shape.bezierCurveTo(1.04,-.46,.47,-.49,-.05,-.12);
  shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,curveSegments:8});
  geometry.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(geometry,material);
  mesh.castShadow=true;
  parent.add(mesh);
}
function wristPanel(parent, material) {
  const shape=new THREE.Shape();
  shape.moveTo(-.07,.19);
  shape.bezierCurveTo(.34,.28,.89,.49,1.18,.38);
  shape.lineTo(1.35,.12);
  shape.bezierCurveTo(1.09,-.24,.42,-.40,-.08,-.29);
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
    for(let i=0;i<7;i++){
      const x=.20+i*.17;
      feather(wing,featherMat,x,-.22,x+.11,-.83+Math.abs(i-3)*.055,.105,-.025);
    }
    const wrist=new THREE.Group();
    wrist.position.set(1.27,0,-.02);
    wristPanel(wrist,wingMat);
    for(let i=0;i<5;i++){
      const x=.16+i*.18;
      feather(wrist,featherMat,x,.03,1.18+i*.085,-.73+i*.16,.12,-.012);
    }
    for(let i=0;i<6;i++) feather(wing,eagle?mats.eagleGold:mats.flockChest,.14+i*.24,.02,.43+i*.23,-.22,.055,.09);
    wing.add(wrist);
    body.add(wing);
    wings.push({wing,wrist,side});
  }
  if (!eagle) group.scale.setScalar(.48);
  group.userData.wings=wings;
  group.userData.bill=bill;
  group.userData.animate=(phase,amplitude=1)=>{
    const stroke=Math.cos(phase);
    const recovery=Math.max(0,-Math.sin(phase));
    for (const {wing,wrist,side} of wings) {
      wing.rotation.z=side*(.06+1.04*stroke)*amplitude;
      wing.rotation.x=.06*Math.sin(phase)*amplitude;
      wrist.rotation.y=.52*recovery*amplitude;
      wrist.rotation.z=-.25*recovery*amplitude;
    }
    body.rotation.y=Math.sin(phase)*.012*amplitude;
  };
  return group;
}

const flightBird=makeBird('small');
flightBird.scale.setScalar(1.25);
flightBird.rotation.y=-.12;
flightBird.position.y=2.9;
scene.add(flightBird);
const comparisonGroup=new THREE.Group();
scene.add(comparisonGroup);
const comparisonBirds={
  eagle:{name:'Golden eagle',fact:'Broad wings help it soar and glide for long stretches.',rate:1.2,kind:'eagle'},
  owl:{name:'Great horned owl',fact:'Broad, softly edged flight feathers help it approach prey quietly.',rate:1.8,kind:'owl'},
  hummingbird:{name:'Ruby-throated hummingbird',fact:'Small wings beat rapidly so it can hover at flowers.',rate:4.5,kind:'hummingbird'}
};
const comparisonPairs={
  'soar-hover':{left:'eagle',right:'hummingbird',question:'Which bird can stay near one flower, and which can travel on rising air?'},
  'quiet-hover':{left:'owl',right:'hummingbird',question:'How do soft, quiet feathers and rapid hovering wings help with different kinds of food?'},
  'soar-quiet':{left:'eagle',right:'owl',question:'Both birds have broad wings. How is quiet flight different from soaring?'}
};
const comparisonModels={};
for(const [key,bird] of Object.entries(comparisonBirds)){
  const model=makeBird(bird.kind==='eagle'?'eagle':'small');
  if(key==='eagle')model.scale.setScalar(.70);
  if(key==='owl')model.scale.setScalar(.80);
  if(key==='hummingbird')model.scale.setScalar(.68);
  if(key!=='eagle'){
    const colours=key==='owl'?new Map([[mats.flockBody,0x745841],[mats.flockWing,0x795f48],[mats.flockFeather,0x574739],[mats.flockChest,0xb8a082]]):new Map([[mats.flockBody,0x23815c],[mats.flockWing,0x20704f],[mats.flockFeather,0x175a49],[mats.flockChest,0xe5ddd0]]);
    model.traverse(object=>{if(object.isMesh&&colours.has(object.material)){const original=object.material;object.material=original.clone();object.material.color.setHex(colours.get(original))}});
  }
  for(const {wing,side} of model.userData.wings){
    if(key==='owl'){wing.scale.x=side*1.3;wing.scale.z=1.22}
    if(key==='hummingbird'){wing.scale.x=side*.84;wing.scale.z=.72}
  }
  if(key==='hummingbird')model.userData.bill.scale.set(.62,2.0,.62);
  model.rotation.y=-.12;
  model.visible=false;
  comparisonGroup.add(model);
  comparisonModels[key]=model;
}
const liftArrow=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(-2.2,1.9,.7),2.2,0x2d9a72,.48,.3);
const weightArrow=new THREE.ArrowHelper(new THREE.Vector3(0,-1,0),new THREE.Vector3(2.2,5.0,.7),2.2,0xd66a49,.48,.3);
const thrustArrow=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(-3.4,2.3,-1.3),1.8,0xb776bf,.5,.32);
const dragArrow=new THREE.ArrowHelper(new THREE.Vector3(0,0,-1),new THREE.Vector3(3.4,2.3,1.4),1.6,0x4c8eb3,.5,.32);
scene.add(liftArrow,weightArrow,thrustArrow,dragArrow);
const airflow=[];
const airflowMat=new THREE.MeshBasicMaterial({color:0x2f92b0,transparent:true,opacity:.7});
for(let i=0;i<12;i++){
  const streak=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.65,5),airflowMat);
  streak.rotation.x=Math.PI/2;
  streak.position.set((i%4-1.5)*2.1,1.5+Math.floor(i/4)*1.05,randomRange(-5,5));
  scene.add(streak);airflow.push(streak);
}
const flockGroup=new THREE.Group();
scene.add(flockGroup);
flockGroup.visible=false;

const state={
  mode:'flight',
  flight:{airspeed:14,spread:1,beatRate:3,style:'alternate',time:0,altitude:30,verticalSpeed:0,running:true,readoutTime:0,wingAmplitude:1},
  flock:{size:16,separation:1.4,alignment:1,cohesion:.8,running:true,time:0},
  comparison:{pair:'soar-hover',time:0}
};
// Chatterjee et al. (2007), Table 1: mass 4.6 kg, weight 45 N,
// wing area 0.65 m², modelled cruise speed 16 m/s. NASA's lift equation is
// L = 0.5 * rho * v² * S * CL. CL is calibrated so L=W at the reference case;
// it is held fixed as students change v and the illustrative exposed area.
const REFERENCE_SPEED_MPS=16;
const REFERENCE_WEIGHT_N=45;
const REFERENCE_WING_AREA_M2=.65;
const REFERENCE_MASS_KG=4.6;
const AIR_DENSITY_KG_M3=1.225;
// This additional lift is an explicit teaching-model assumption, not a
// measured force for every bird. The 3 s alternation is also illustrative.
const FLAP_LIFT_N_PER_HZ=5;
const VERTICAL_DRAG_N_PER_MPS_SQUARED=1.5;
const ALTITUDE_MIN_M=0;
const ALTITUDE_MAX_M=60;
const REFERENCE_CL=REFERENCE_WEIGHT_N/(.5*AIR_DENSITY_KG_M3*REFERENCE_SPEED_MPS**2*REFERENCE_WING_AREA_M2);
function wingsPowered(){
  const f=state.flight;
  return f.style==='flap'||(f.style==='alternate'&&Math.floor(f.time/3)%2===0);
}
function beatLabel(rate){return `${rate} ${rate===1?'beat':'beats'}/s`}
function flightForces(){
  const f=state.flight;
  const area=REFERENCE_WING_AREA_M2*f.spread;
  const airflowLift=.5*AIR_DENSITY_KG_M3*f.airspeed**2*area*REFERENCE_CL;
  const beatLift=wingsPowered()?f.beatRate*FLAP_LIFT_N_PER_HZ:0;
  const totalLift=airflowLift+beatLift;
  const verticalDrag=-VERTICAL_DRAG_N_PER_MPS_SQUARED*f.verticalSpeed*Math.abs(f.verticalSpeed);
  return {area,airflowLift,beatLift,totalLift,weight:REFERENCE_WEIGHT_N,verticalDrag,net:totalLift-REFERENCE_WEIGHT_N+verticalDrag};
}
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
  if(state.mode!=='flight')return;
  const f=state.flight;
  if(f.running){
    f.time+=dt;
    const forces=flightForces();
    f.verticalSpeed+=forces.net/REFERENCE_MASS_KG*dt;
    f.altitude=THREE.MathUtils.clamp(f.altitude+f.verticalSpeed*dt,ALTITUDE_MIN_M,ALTITUDE_MAX_M);
    if((f.altitude===ALTITUDE_MIN_M&&f.verticalSpeed<0)||(f.altitude===ALTITUDE_MAX_M&&f.verticalSpeed>0))f.verticalSpeed=0;
  }
  const forces=flightForces();
  // Keep every metre in the 0–60 m experiment visible, including takeoff.
  const targetY=1.25+(f.altitude/ALTITUDE_MAX_M)*3.3;
  flightBird.position.y=THREE.MathUtils.damp(flightBird.position.y,targetY,5,dt);
  flightBird.position.x=0;
  flightBird.rotation.z=THREE.MathUtils.damp(flightBird.rotation.z,THREE.MathUtils.clamp(f.verticalSpeed/18,-.13,.13),3.5,dt);
  flightBird.rotation.x=0;
  for(const {wing,side} of flightBird.userData.wings)wing.scale.x=side*1.1*f.spread;
  f.wingAmplitude=THREE.MathUtils.damp(f.wingAmplitude,wingsPowered()?1:0,5,dt);
  flightBird.userData.animate(f.time*f.beatRate*Math.PI*2,f.wingAmplitude);
  liftArrow.position.set(-2.2,flightBird.position.y-1.55,.7);
  weightArrow.position.set(2.2,flightBird.position.y+1.4,.7);
  liftArrow.setLength(THREE.MathUtils.clamp(forces.totalLift/22,.6,2.7),.48,.3);
  weightArrow.setLength(2.05,.48,.3);
  thrustArrow.visible=wingsPowered();
  thrustArrow.position.y=flightBird.position.y-.6;
  thrustArrow.setLength(1.15+f.beatRate*.16,.5,.32);
  const forwardDrag=8*(f.airspeed/16)**2;
  dragArrow.position.y=flightBird.position.y-.6;
  dragArrow.setDirection(new THREE.Vector3(0,forces.verticalDrag,-forwardDrag).normalize());
  dragArrow.setLength(THREE.MathUtils.clamp(Math.hypot(forwardDrag,forces.verticalDrag)/7,.5,2.6),.5,.32);
  for(const streak of airflow){streak.position.z+=dt*f.airspeed*.24;if(streak.position.z>6)streak.position.z=-6}
  f.readoutTime+=dt;
  if(f.readoutTime>.12){f.readoutTime=0;updateFlightReadout()}
}
function updateFlightReadout(){
  const f=state.flight;
  const {totalLift,weight,net}=flightForces();
  $('#liftValue').textContent=`${totalLift.toFixed(1)} N`;
  $('#weightValue').textContent=`${weight.toFixed(1)} N`;
  $('#netValue').textContent=`${net>=0?'+':''}${net.toFixed(1)} N`;
  $('#heightValue').textContent=`${f.altitude.toFixed(1)} m`;
  $('#verticalSpeedValue').textContent=`${f.verticalSpeed>=0?'+':''}${f.verticalSpeed.toFixed(1)} m/s`;
  $('#beatValue').textContent=wingsPowered()?beatLabel(f.beatRate):'Gliding';
  $('#altitudeMarker').style.bottom=`${100*f.altitude/ALTITUDE_MAX_M}%`;
  const motion=f.verticalSpeed>.15?'Rising':f.verticalSpeed<-.15?'Sinking':'Level for now';
  const force=net>1?'upward force is stronger':net< -1?'downward force is stronger':'vertical forces are balanced';
  const phase=f.style==='alternate'?(wingsPowered()?'Flap phase':'Glide phase'):(wingsPowered()?'Flapping':'Gliding');
  const slowing=(f.verticalSpeed>.15&&net< -1)||(f.verticalSpeed<-.15&&net>1);
  const boundary=f.altitude===ALTITUDE_MAX_M&&net>0?' The bird reached the top of this experiment.':f.altitude===ALTITUDE_MIN_M&&net<0?' At 0 m, add enough lift to exceed weight and take off again.':f.altitude<.2&&net>0?' Lift now exceeds weight, so the bird is taking off again.':'';
  const result=`${phase} · ${motion}. The ${force}.${slowing?' It is slowing before it changes direction.':''}${boundary}`;
  $('#scenarioMode').textContent=result;
  $('#sceneCallout').textContent=result;
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
function selectComparison(key){
  const pair=comparisonPairs[key];
  state.comparison.pair=key;
  for(const [name,model] of Object.entries(comparisonModels))model.visible=name===pair.left||name===pair.right;
  comparisonModels[pair.left].position.set(-2.45,2.75,0);
  comparisonModels[pair.right].position.set(2.45,2.75,0);
  for(const [side,name] of [['Left',pair.left],['Right',pair.right]]){
    const bird=comparisonBirds[name];
    $('#compare'+side+'Label').textContent=bird.name;
    $('#compare'+side+'Name').textContent=bird.name;
    $('#compare'+side+'Fact').textContent=bird.fact;
    const portrait=$('#compare'+side+'Portrait');
    portrait.className=`compare-portrait bird-${name}`;
    portrait.setAttribute('aria-label',`Generated illustration of a ${bird.name.toLowerCase()}`);
  }
  $('#compareQuestion').textContent=pair.question;
  document.querySelectorAll('[data-comparison]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.comparison===key)));
}
function updateComparison(dt){
  if(state.mode!=='compare')return;
  state.comparison.time+=dt;
  for(const [name,model] of Object.entries(comparisonModels)){
    if(!model.visible)continue;
    const rate=comparisonBirds[name].rate;
    model.userData.animate(state.comparison.time*rate*Math.PI*2,name==='eagle'?.55:name==='owl'?.7:.9);
    model.position.y=2.75+Math.sin(state.comparison.time*rate*Math.PI*2)*.07;
  }
}
document.querySelectorAll('[data-comparison]').forEach(button=>button.addEventListener('click',()=>selectComparison(button.dataset.comparison)));
selectComparison(state.comparison.pair);

$('#airspeed').addEventListener('input',event=>{state.flight.airspeed=Number(event.target.value);$('#airspeedOutput').textContent=`${state.flight.airspeed} m/s`;updateFlightReadout()});
$('#spread').addEventListener('input',event=>{state.flight.spread=Number(event.target.value)/100;$('#spreadOutput').textContent=`${event.target.value}%`;updateFlightReadout()});
$('#beatRate').addEventListener('input',event=>{state.flight.beatRate=Number(event.target.value);$('#beatRateOutput').textContent=beatLabel(state.flight.beatRate);updateFlightReadout()});
function setFlightStyle(style){
  state.flight.style=style;
  state.flight.time=0;
  for(const [id,value] of [['flapButton','flap'],['glideButton','glide'],['alternateButton','alternate']])$('#'+id).setAttribute('aria-pressed',String(style===value));
  updateFlightReadout();
}
$('#flapButton').addEventListener('click',()=>setFlightStyle('flap'));
$('#glideButton').addEventListener('click',()=>setFlightStyle('glide'));
$('#alternateButton').addEventListener('click',()=>setFlightStyle('alternate'));
const flockInputs=[['separation','separationOutput'],['alignment','alignmentOutput'],['cohesion','cohesionOutput']];
for(const [id,output] of flockInputs){$("#"+id).addEventListener('input',event=>{state.flock[id]=Number(event.target.value);$("#"+output).textContent=Number(event.target.value).toFixed(1)})}
$('#flockSize').addEventListener('input',event=>{$('#flockSizeOutput').textContent=event.target.value});
$('#flockSize').addEventListener('change',event=>{state.flock.size=Number(event.target.value);buildFlock(state.flock.size)});

$('#flockToggle').addEventListener('click',()=>{state.flock.running=!state.flock.running;$('#flockToggle').textContent=state.flock.running?'Pause flock':'Resume flock'});
$('#flightToggle').addEventListener('click',()=>{state.flight.running=!state.flight.running;$('#flightToggle').textContent=state.flight.running?'Pause flight':'Resume flight'});
$('#flightReset').addEventListener('click',()=>{
  Object.assign(state.flight,{airspeed:14,spread:1,beatRate:3,style:'alternate',time:0,altitude:30,verticalSpeed:0,running:true,readoutTime:0,wingAmplitude:1});
  $('#airspeed').value='14';$('#spread').value='100';$('#beatRate').value='3';
  $('#airspeedOutput').textContent='14 m/s';$('#spreadOutput').textContent='100%';$('#beatRateOutput').textContent='3 beats/s';
  $('#flightToggle').textContent='Pause flight';setFlightStyle('alternate');
});
$('#flockReset').addEventListener('click',()=>{
  Object.assign(state.flock,{size:16,separation:1.4,alignment:1,cohesion:.8,running:true,time:0});
  $('#flockSize').value='16';$('#separation').value='1.4';$('#alignment').value='1';$('#cohesion').value='.8';
  $('#flockSizeOutput').textContent='16';$('#separationOutput').textContent='1.4';$('#alignmentOutput').textContent='1.0';$('#cohesionOutput').textContent='0.8';$('#flockToggle').textContent='Pause flock';
  buildFlock(16);
});

let previousOrbit=null;
function setMode(mode){
  if(mode==='compare'&&state.mode!=='compare'){
    previousOrbit={...orbit};
    Object.assign(orbit,{yaw:.16,pitch:.32,radius:8.3*Math.max(1,1.32/camera.aspect)});
    updateCamera();
  }else if(state.mode==='compare'&&mode!=='compare'&&previousOrbit){
    Object.assign(orbit,previousOrbit);
    updateCamera();
  }
  state.mode=mode;
  const flight=mode==='flight';
  const flock=mode==='flock';
  const compare=mode==='compare';
  flightBird.visible=flight;flockGroup.visible=flock;comparisonGroup.visible=compare;
  ground.visible=flock;hills.forEach(hill=>hill.visible=flock);
  liftArrow.visible=flight;weightArrow.visible=flight;dragArrow.visible=flight;thrustArrow.visible=flight&&wingsPowered();airflow.forEach(item=>item.visible=flight);
  $('#flightControls').hidden=!flight;$('#flockControls').hidden=!flock;$('#compareControls').hidden=!compare;
  $('#flightReadout').hidden=!flight;$('#flockReadout').hidden=!flock;
  $('#flightExtra').hidden=!flight;
  $('#labTitle').textContent=flight?'How do birds fly?':flock?'How does a flock move together?':'How do wings fit different jobs?';
  $('#stageLabel').textContent=flight?'BIRD FLIGHT · 3D FORCE MODEL':flock?'MODEL BIRDS · FLOCKING RULES':'WING ADAPTATIONS · SIMPLIFIED 3D MODELS';
  $('#forceKey').hidden=!flight;$('#sceneCallout').hidden=!flight;$('#altitudeMeter').hidden=!flight;
  $('#compareStageLabels').hidden=!compare;
  for(const [name,tab] of [['flight','#flightTab'],['flock','#flockTab'],['compare','#compareTab']]){$(tab).setAttribute('aria-selected',String(mode===name));$(tab).tabIndex=mode===name?0:-1}
}
$('#flightTab').addEventListener('click',()=>setMode('flight'));
$('#flockTab').addEventListener('click',()=>setMode('flock'));
$('#compareTab').addEventListener('click',()=>setMode('compare'));
for(const tab of [$('#flightTab'),$('#flockTab'),$('#compareTab')])tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const modes=['flight','flock','compare'];const direction=event.key==='ArrowRight'?1:-1;const next=modes[(modes.indexOf(state.mode)+direction+modes.length)%modes.length];setMode(next);$('#'+next+'Tab').focus()}});
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

function resize(){const width=stage.clientWidth,height=stage.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(state.mode==='compare'){orbit.radius=8.3*Math.max(1,1.32/camera.aspect);updateCamera()}}
new ResizeObserver(resize).observe(stage);
resize();
const clock=new THREE.Clock();
function frame(){const dt=Math.min(clock.getDelta(),.05);updateFlight(dt);updateFlock(dt);updateComparison(dt);clouds.forEach((cloud,i)=>{cloud.position.x+=dt*(.11+i*.025);if(cloud.position.x>18)cloud.position.x=-18});renderer.render(scene,camera);requestAnimationFrame(frame)}
frame();
