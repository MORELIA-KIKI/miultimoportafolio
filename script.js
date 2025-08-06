document.addEventListener("DOMContentLoaded", () => {
  // Si existen los elementos de login y registro, ejecutamos
  if (document.getElementById("btn-register") && document.getElementById("btn-login")) {
    const msg = (text) => (document.getElementById("message").textContent = text);

    document.getElementById("btn-register").addEventListener("click", () => {
      const u = document.getElementById("reg-user").value.trim();
      const p = document.getElementById("reg-pass").value.trim();
      if (!u || !p) return msg("⚠️ Todos los campos son obligatorios.");

      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[u]) return msg("⚠️ El usuario ya está registrado.");

      users[u] = { pass: p, tareas: [] };
      localStorage.setItem("users", JSON.stringify(users));
      msg("✅ Registro exitoso.");
    });

    document.getElementById("btn-login").addEventListener("click", () => {
      const u = document.getElementById("log-user").value.trim();
      const p = document.getElementById("log-pass").value.trim();
      const users = JSON.parse(localStorage.getItem("users") || "{}");

      if (users[u]?.pass === p) {
        localStorage.setItem("currentUser", u);
        window.location.href = "dashboard.html";
      } else {
        msg("❌ Credenciales incorrectas.");
      }
    });
  }
});


/*Tareas*/
document.addEventListener("DOMContentLoaded", () => {
      const contenedor = document.getElementById("contenedorTareas");
      const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

      if (tareas.length === 0) {
        contenedor.innerHTML = "<p>No hay tareas guardadas.</p>";
        return;
      }

      tareas.forEach(tarea => {
        const div = document.createElement("div");
        div.classList.add("tarea");

        let contenido = "";
        const tipo = tarea.archivoBase64.split(";")[0];

        if (tipo.includes("image")) {
          contenido = `<img src="${tarea.archivoBase64}" alt="Imagen de la tarea">`;
        } else if (tipo.includes("pdf")) {
          contenido = `<a href="${tarea.archivoBase64}" target="_blank">📄 Ver PDF</a>`;
        } else {
          contenido = `<a href="${tarea.archivoBase64}" download="${tarea.nombre}">⬇️ Descargar archivo</a>`;
        }

        div.innerHTML = `<strong>${tarea.nombre}</strong><br>${contenido}`;
        contenedor.appendChild(div);
      });
    });
