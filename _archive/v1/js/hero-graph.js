(function () {
  if (!window.THREE) return;
  var canvas = document.getElementById('heroGraph3D');
  if (!canvas) return;
  var section = document.getElementById('need') || canvas.parentElement;
  if (!section) return;

  /* ── Renderer — taller than section so graph can spill below ─────────── */
  var W  = section.clientWidth  || window.innerWidth;
  var SH = Math.max(section.clientHeight, 820);
  var H  = SH + 420;   /* extra height for spillover */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(W, H);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
  camera.position.set(-3.5, -1.0, 8.5);   /* start: graph appears on right side */

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));

  /* ── OrbitControls ───────────────────────────────────────────────────── */
  var controls = null;
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(-3.5, -1.0, 0);  /* offset target left → graph on right */
    controls.enableZoom    = false;
    controls.enablePan     = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed   = 0.5;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.30;
    controls.update();
  }

  /* ── Icon textures ─────────────────────────────────────────────────────── */
  function makeIconTex(icon, fontSize) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    if (icon === '__cal__') {
      ctx.strokeStyle = 'rgba(255,255,255,0.93)';
      ctx.fillStyle   = 'rgba(255,255,255,0.93)';
      ctx.lineWidth   = 5;
      ctx.lineCap     = 'square';
      ctx.fillRect(36, 10, 9, 24);    /* left tab  */
      ctx.fillRect(83, 10, 9, 24);    /* right tab */
      ctx.strokeRect(12, 22, 104, 94);
      ctx.beginPath(); ctx.moveTo(12, 50); ctx.lineTo(116, 50); ctx.stroke();
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('MAY', 64, 36);
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('15', 64, 84);
      return new THREE.CanvasTexture(c);
    }
    fontSize = fontSize || 58;
    ctx.shadowColor = 'rgba(60,0,160,0.28)';
    ctx.shadowBlur  = 5;
    ctx.fillStyle   = 'rgba(255,255,255,0.95)';
    ctx.font        = 'bold ' + fontSize + 'px sans-serif';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 64, 66);
    return new THREE.CanvasTexture(c);
  }

  /* ── Node types ───────────────────────────────────────────────────────── */
  var TYPES = [
    { icon: '✉',    fontSize: 76, count: 8 },
    { icon: '__cal__',             count: 7 },
    { icon: '⌕',    fontSize: 74, count: 7 },
    { icon: '✦',    fontSize: 68, count: 7 },
    { icon: '≡',    fontSize: 62, count: 3 },
    { icon: '☎',    fontSize: 62, count: 2 },
    { icon: '✈',    fontSize: 76, count: 2 },
    { icon: 'Σ',    fontSize: 62, count: 3 },
    { icon: '>_',        fontSize: 52, count: 2 },
    { icon: '⚖',    fontSize: 60, count: 2 },
    { icon: '♥',    fontSize: 60, count: 2 },
    { icon: '@',         fontSize: 62, count: 2 },
    { icon: '⊕',    fontSize: 60, count: 1 },
    { icon: '⇒',    fontSize: 60, count: 2 },
    { icon: '◎',    fontSize: 60, count: 2 }
  ];

  var iconDefs = [];
  TYPES.forEach(function (t) {
    for (var i = 0; i < t.count; i++) iconDefs.push({ icon: t.icon, fontSize: t.fontSize });
  });
  var N = iconDefs.length;

  /* ── Fibonacci sphere, pushed right, elongated ───────────────────────── */
  var PHI      = (1 + Math.sqrt(5)) / 2;
  var X_OFFSET = 2.6;
  var R        = 3.8;
  var basePts  = [];
  for (var i = 0; i < N; i++) {
    var theta = Math.acos(1 - 2 * (i + 0.5) / N);
    var phi   = 2 * Math.PI * i / PHI;
    basePts.push(new THREE.Vector3(
      X_OFFSET + R * Math.sin(theta) * Math.cos(phi) + (Math.random()-0.5) * 0.55,
               R * 1.1  * Math.sin(theta) * Math.sin(phi) + (Math.random()-0.5) * 0.55,
               R * 0.9  * Math.cos(theta)               + (Math.random()-0.5) * 0.55
    ));
  }

  /* ── Colours ─────────────────────────────────────────────────────────── */
  var COL_NORMAL = new THREE.Color(0x5200E3);
  var COL_HOVER  = new THREE.Color(0x8B5CF6);
  var OPA_NORMAL = 0.25;
  var OPA_HOVER  = 0.55;
  var SPHERE_R   = 0.20;
  var SPRITE_SC  = 0.58;

  /* ── Build nodes ─────────────────────────────────────────────────────── */
  var nodes = [], meshes = [];
  iconDefs.forEach(function (def, i) {
    var mat = new THREE.MeshBasicMaterial({
      color: COL_NORMAL.clone(), transparent: true, opacity: OPA_NORMAL
    });
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(SPHERE_R, 22, 22), mat);
    mesh.position.copy(basePts[i]);
    scene.add(mesh);
    meshes.push(mesh);

    var sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeIconTex(def.icon, def.fontSize),
      transparent: true, opacity: 0.90, depthTest: false
    }));
    sp.scale.set(SPRITE_SC, SPRITE_SC, 1);
    sp.position.copy(basePts[i]);
    scene.add(sp);

    nodes.push({
      mesh: mesh, sprite: sp,
      base: basePts[i].clone(),
      px: Math.random()*6.28, py: Math.random()*6.28, pz: Math.random()*6.28,
      curScale: 1.0, tgtScale: 1.0,
      curOpa: OPA_NORMAL, tgtOpa: OPA_NORMAL,
      hovered: false, dragging: false
    });
  });

  /* ── Edges ───────────────────────────────────────────────────────────── */
  var pairs = [], seen = {};
  nodes.forEach(function (a, i) {
    var ds = nodes
      .map(function (b, j) { return {j:j, d:a.base.distanceTo(b.base)}; })
      .filter(function (x) { return x.j !== i; })
      .sort(function (x, y) { return x.d - y.d; });
    ds.slice(0, 2 + (Math.random()<0.45?1:0)).forEach(function(item){
      var lo=Math.min(i,item.j), hi=Math.max(i,item.j), key=lo+'_'+hi;
      if (!seen[key]) { seen[key]=true; pairs.push([i,item.j]); }
    });
  });

  /* ── Edges (LineSegments2 for true per-pixel linewidth) ─────────────── */
  var ePositions = new Float32Array(pairs.length * 6);
  /* initialise positions before first setPositions call */
  pairs.forEach(function(p,k){
    var a=nodes[p[0]].mesh.position, b=nodes[p[1]].mesh.position;
    ePositions[k*6]=a.x; ePositions[k*6+1]=a.y; ePositions[k*6+2]=a.z;
    ePositions[k*6+3]=b.x; ePositions[k*6+4]=b.y; ePositions[k*6+5]=b.z;
  });

  var useThick = !!(THREE.LineSegmentsGeometry && THREE.LineMaterial && THREE.LineSegments2);
  var eGeo2, eInstBuf, eLines;
  if (useThick) {
    eGeo2 = new THREE.LineSegmentsGeometry();
    eGeo2.setPositions(ePositions);
    eInstBuf = eGeo2.getAttribute('instanceStart').data; /* InterleavedBuffer shared by start+end */
    var eMat2 = new THREE.LineMaterial({color:0x9575CD, linewidth:3, transparent:true, opacity:0.20, resolution: new THREE.Vector2(W, H)});
    eLines = new THREE.LineSegments2(eGeo2, eMat2);
    scene.add(eLines);
  } else {
    /* WebGL linewidth fallback */
    var eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePositions, 3));
    scene.add(new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({color:0x9575CD, transparent:true, opacity:0.20})));
  }

  function refreshEdges() {
    pairs.forEach(function(p,k){
      var a=nodes[p[0]].mesh.position, b=nodes[p[1]].mesh.position;
      ePositions[k*6]=a.x; ePositions[k*6+1]=a.y; ePositions[k*6+2]=a.z;
      ePositions[k*6+3]=b.x; ePositions[k*6+4]=b.y; ePositions[k*6+5]=b.z;
    });
    if (useThick) {
      /* copy into the interleaved buffer that backs instanceStart & instanceEnd */
      eInstBuf.array.set(ePositions);
      eInstBuf.needsUpdate = true;
    } else {
      eLines.geometry.attributes.position.needsUpdate = true;
    }
  }

  /* ── Raycaster + shared state ─────────────────────────────────────────── */
  var rc         = new THREE.Raycaster();
  var mouse      = new THREE.Vector2();
  var hovNode    = null;
  var dragNode   = null;
  var dragPlane  = new THREE.Plane();
  var dragIsect  = new THREE.Vector3();
  var dragOffset = new THREE.Vector3();

  function toNDC(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    mouse.x =  (clientX - r.left) / r.width  * 2 - 1;
    mouse.y = -((clientY - r.top)  / r.height * 2 - 1);
  }

  /* ── Per-node drag — CAPTURE PHASE fires before OrbitControls ──────────
     stopImmediatePropagation() prevents OrbitControls from seeing the event
     when the click lands on a node, so only that node moves.               */
  canvas.addEventListener('mousedown', function (e) {
    toNDC(e.clientX, e.clientY);
    rc.setFromCamera(mouse, camera);
    var hits = rc.intersectObjects(meshes);
    if (hits.length === 0) return;          /* no hit — fall through to OrbitControls */

    var hitMesh = hits[0].object;
    nodes.forEach(function(n){ if (n.mesh === hitMesh) dragNode = n; });
    if (!dragNode) return;

    /* Build drag plane: camera-facing, through the hit point */
    var camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.setFromNormalAndCoplanarPoint(camDir, hits[0].point);
    dragOffset.subVectors(dragNode.mesh.position, hits[0].point);
    dragNode.dragging = true;

    if (controls) { controls.enabled = false; controls.autoRotate = false; }
    canvas.style.cursor = 'grabbing';

    /* Stop OrbitControls from also receiving this event */
    e.stopImmediatePropagation();

    /* Track drag at document level so it survives moving outside canvas */
    function onDragMove(ev) {
      toNDC(ev.clientX, ev.clientY);
      rc.setFromCamera(mouse, camera);
      if (rc.ray.intersectPlane(dragPlane, dragIsect)) {
        var np = dragIsect.clone().add(dragOffset);
        dragNode.base.copy(np);
        dragNode.mesh.position.copy(np);
        dragNode.sprite.position.copy(np);
      }
    }
    function onDragUp() {
      dragNode.base.copy(dragNode.mesh.position);
      dragNode.dragging = false;
      dragNode = null;
      if (controls) { controls.enabled = true; controls.autoRotate = true; }
      canvas.style.cursor = hovNode ? 'pointer' : 'grab';
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup',   onDragUp);
    }
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup',   onDragUp);

  }, true);  /* <-- capture phase: fires before OrbitControls */

  /* ── Hover ───────────────────────────────────────────────────────────── */
  canvas.addEventListener('mousemove', function (e) {
    if (dragNode) return;   /* suppress hover during node drag */
    toNDC(e.clientX, e.clientY);
    rc.setFromCamera(mouse, camera);
    var hits  = rc.intersectObjects(meshes);
    var h     = hits.length ? hits[0].object : null;
    var hNode = null;
    if (h) nodes.forEach(function(n){ if (n.mesh===h) hNode=n; });
    if (hNode !== hovNode) {
      if (hovNode) { hovNode.hovered=false; hovNode.tgtScale=1.0; hovNode.tgtOpa=OPA_NORMAL; }
      hovNode = hNode;
      if (hovNode) { hovNode.hovered=true; hovNode.tgtScale=1.18; hovNode.tgtOpa=OPA_HOVER; }
    }
    canvas.style.cursor = hovNode ? 'pointer' : 'grab';
  });

  canvas.addEventListener('mousedown', function() {
    /* Bubble-phase handler: only fires when OrbitControls will handle it */
    if (!dragNode && controls) { controls.autoRotate = false; }
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('mouseup', function () {
    if (controls) controls.autoRotate = true;
    canvas.style.cursor = hovNode ? 'pointer' : 'grab';
  });

  canvas.addEventListener('mouseleave', function () {
    if (hovNode) { hovNode.hovered=false; hovNode.tgtScale=1.0; hovNode.tgtOpa=OPA_NORMAL; hovNode=null; }
    if (controls) controls.autoRotate = true;
    canvas.style.cursor = 'grab';
  });

  /* ── Resize ──────────────────────────────────────────────────────────── */
  window.addEventListener('resize', function () {
    var w  = section.clientWidth || window.innerWidth;
    var sh = Math.max(section.clientHeight, 820);
    var h  = sh + 420;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  /* ── Animation loop ──────────────────────────────────────────────────── */
  /* Reduced-motion: kill auto-animation (float + auto-rotate). Drag/hover still work. */
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduceMotion && controls) controls.autoRotate = false;

  var LERP = 0.042;
  var rafId = null;
  function tick(t) {
    rafId = requestAnimationFrame(tick);
    var time = t*0.001, amp = reduceMotion ? 0 : 0.07, spd=0.15;
    nodes.forEach(function (n) {
      if (!n.dragging) {
        n.mesh.position.set(
          n.base.x + Math.sin(time*spd + n.px)*amp,
          n.base.y + Math.cos(time*spd + n.py)*amp,
          n.base.z + Math.sin(time*spd + n.pz)*amp*0.5
        );
      }
      n.sprite.position.copy(n.mesh.position);
      n.curScale += (n.tgtScale - n.curScale) * LERP;
      n.curOpa   += (n.tgtOpa   - n.curOpa)   * LERP;
      n.mesh.scale.setScalar(n.curScale);
      n.sprite.scale.setScalar(SPRITE_SC * n.curScale);
      n.mesh.material.opacity = n.curOpa;
      if (!n.hovered) n.mesh.material.color.lerp(COL_NORMAL, 0.08);
    });
    refreshEdges();
    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  function start() { if (rafId === null) rafId = requestAnimationFrame(tick); }
  function stop()  { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

  /* Only run the rAF loop while the graph is actually on screen. */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 });
    io.observe(canvas);
  } else {
    start();
  }
})();
