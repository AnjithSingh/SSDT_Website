/* THREE.JS */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  alpha: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const geometry = new THREE.TorusKnotGeometry(10, 2.8, 120, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0xf5c542,
  metalness: 0.8,
  roughness: 0.2
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(20,20,20);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.003;
  torus.rotation.y += 0.004;
  renderer.render(scene, camera);
}
animate();

/* PARTICLES */
const pCanvas = document.getElementById("particles");
const ctx = pCanvas.getContext("2d");
pCanvas.width = innerWidth;
pCanvas.height = innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function drawParticles() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.fillStyle = "rgba(245,197,66,0.6)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* SCROLL REVEAL */
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
});

/* FORM → WHATSAPP */
function sendWhatsApp(e) {
  e.preventDefault();
  const msg =
`Admission Enquiry
Student: ${student.value}
Class: ${class.value}
Parent: ${parent.value}
Phone: ${phone.value}`;
  window.open(`https://wa.me/916303423475?text=${encodeURIComponent(msg)}`);
}