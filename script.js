function sendWhatsApp(e) {
  e.preventDefault();

  const student = document.getElementById("student").value;
  const cls = document.getElementById("class").value;
  const parent = document.getElementById("parent").value;
  const phone = document.getElementById("phone").value;

  const text =
    `Admission Enquiry:%0A` +
    `Student: ${student}%0A` +
    `Class: ${cls}%0A` +
    `Parent: ${parent}%0A` +
    `Phone: ${phone}`;

  window.open(`https://wa.me/916303423475?text=${text}`, "_blank");
}