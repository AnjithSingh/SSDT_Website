function sendWhatsApp(e) {
  e.preventDefault();

  const student = document.getElementById("student").value;
  const cls = document.getElementById("class").value;
  const parent = document.getElementById("parent").value;
  const phone = document.getElementById("phone").value;
  const school = document.getElementById("school").value;
  const message = document.getElementById("message").value;

  const text =
    `Admission Enquiry:%0A` +
    `Student Name: ${student}%0A` +
    `Class: ${cls}%0A` +
    `Parent Name: ${parent}%0A` +
    `Mobile: ${phone}%0A` +
    `School/College: ${school}%0A` +
    `Message: ${message}`;

  window.open(`https://wa.me/918340011651?text=${text}`, "_blank");
}