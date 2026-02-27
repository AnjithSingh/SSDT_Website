/* =====================
   CUSTOM CURSOR
   ===================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .course-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
    follower.style.borderColor = 'rgba(245,197,66,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(245,197,66,0.5)';
  });
});


/* =====================
   HEADER SCROLL STATE
   ===================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});


/* =====================
   THREE.JS — HERO 3D SCENE
   ===================== */
(function() {
  const canvas = document.getElementById('bg');
  const W = () => canvas.parentElement.offsetWidth;
  const H = () => canvas.parentElement.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W(), H());
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 1000);
  camera.position.set(0, 0, 38);

  // === Main object: Icosahedron wireframe + solid ===
  const icoGeo = new THREE.IcosahedronGeometry(10, 1);

  // Wireframe shell
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xf5c542,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const wireIco = new THREE.Mesh(icoGeo, wireMat);
  scene.add(wireIco);

  // Inner solid
  const solidMat = new THREE.MeshStandardMaterial({
    color: 0xf5c542,
    metalness: 1.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.12
  });
  const solidIco = new THREE.Mesh(new THREE.IcosahedronGeometry(8.5, 1), solidMat);
  scene.add(solidIco);

  // Outer ring — torus
  const torusGeo = new THREE.TorusGeometry(16, 0.25, 12, 80);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xf5c542,
    transparent: true,
    opacity: 0.22
  });
  const torus1 = new THREE.Mesh(torusGeo, torusMat);
  torus1.rotation.x = Math.PI / 3;
  scene.add(torus1);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(20, 0.12, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xf5c542, transparent: true, opacity: 0.1 })
  );
  torus2.rotation.x = -Math.PI / 4;
  torus2.rotation.z = Math.PI / 6;
  scene.add(torus2);

  // Floating particles around the main object
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 22 + Math.random() * 14;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    pSizes[i] = Math.random() * 2.5 + 0.5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

  const pMat = new THREE.PointsMaterial({
    color: 0xf5c542,
    size: 0.5,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xf5c542, 4, 80);
  goldLight.position.set(25, 25, 25);
  scene.add(goldLight);

  const blueLight = new THREE.PointLight(0x4080ff, 2, 60);
  blueLight.position.set(-20, -20, 10);
  scene.add(blueLight);

  // Mouse parallax
  let targetRotX = 0, targetRotY = 0;
  document.addEventListener('mousemove', e => {
    targetRotY = (e.clientX / innerWidth - 0.5) * 0.6;
    targetRotX = (e.clientY / innerHeight - 0.5) * 0.4;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    wireIco.rotation.x += (targetRotX - wireIco.rotation.x) * 0.03;
    wireIco.rotation.y += (targetRotY - wireIco.rotation.y) * 0.03;
    wireIco.rotation.y += 0.003;
    wireIco.rotation.x += 0.0015;

    solidIco.rotation.x = wireIco.rotation.x;
    solidIco.rotation.y = wireIco.rotation.y;

    torus1.rotation.z += 0.004;
    torus2.rotation.y += 0.003;

    points.rotation.y += 0.001;
    points.rotation.x += 0.0005;

    // Pulsing gold light
    goldLight.intensity = 3.5 + Math.sin(t * 1.8) * 1.2;
    goldLight.position.x = 25 * Math.cos(t * 0.4);
    goldLight.position.z = 25 * Math.sin(t * 0.4);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });
})();


/* =====================
   THREE.JS — ABOUT GLOBE
   ===================== */
(function() {
  const canvas = document.getElementById('globe');
  if (!canvas) return;
  const container = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const W = () => container.offsetWidth;
  const H = () => container.offsetHeight;
  renderer.setSize(W(), H());
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 200);
  camera.position.z = 28;

  // Sphere wireframe
  const sphereGeo = new THREE.SphereGeometry(9, 24, 24);
  const sphereWire = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({
    color: 0xf5c542,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  }));
  scene.add(sphereWire);

  // Rings
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(9 + i * 3, 0.08, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xf5c542, transparent: true, opacity: 0.15 - i * 0.03 })
    );
    r.rotation.x = Math.PI / 2 + (i * Math.PI / 5);
    r.rotation.z = i * Math.PI / 6;
    scene.add(r);
  }

  // Glow inner sphere
  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(7, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      emissive: 0xf5c542,
      emissiveIntensity: 0.05,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.08
    })
  );
  scene.add(glowMesh);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const gl = new THREE.PointLight(0xf5c542, 3, 80);
  gl.position.set(15, 15, 15);
  scene.add(gl);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;
    sphereWire.rotation.y += 0.006;
    sphereWire.rotation.x += 0.002;
    glowMesh.rotation.y -= 0.004;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });
})();


/* =====================
   SCROLL REVEAL
   ===================== */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('active');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Trigger for items already in view
window.dispatchEvent(new Event('scroll'));


/* =====================
   COUNTER ANIMATION
   ===================== */
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));


/* =====================
   CARD TILT EFFECT
   ===================== */
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    card.style.transition = 'transform 0.1s, border-color 0.4s, background 0.4s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, background 0.4s';
  });
});


/* =====================
   FORM → WHATSAPP
   ===================== */
function sendWhatsApp(e) {
  e.preventDefault();
  const msg =
`🎓 *Admission Enquiry — Sri Sai Datta Tutorials*

👤 Student: ${document.getElementById('student').value}
📚 Class: ${document.getElementById('classInput').value}
👨‍👩‍👦 Parent: ${document.getElementById('parent').value}
📞 Phone: ${document.getElementById('phone').value}`;
  window.open(`https://wa.me/916303423475?text=${encodeURIComponent(msg)}`);
}
