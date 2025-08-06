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
    const form = document.getElementById("formTarea");
    const nombreInput = document.getElementById("nombreTarea");
    const archivoInput = document.getElementById("archivoTarea");
    const mensaje = document.getElementById("mensaje");
    const lista = document.getElementById("listaTareas");

    function mostrarTareas() {
      const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");
      lista.innerHTML = "<h3>Tareas Guardadas</h3>";

      tareas.forEach((tarea, index) => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";

        let contenido = "";
        if (tarea.archivoBase64.startsWith("data:image")) {
          contenido = `<img src="${tarea.archivoBase64}" alt="Imagen" style="max-width:100px;">`;
        } else if (tarea.archivoBase64.startsWith("data:application/pdf")) {
          contenido = `<a href="${tarea.archivoBase64}" target="_blank">📄 Ver PDF</a>`;
        } else {
          contenido = `<a href="${tarea.archivoBase64}" download="${tarea.nombre}">⬇️ Descargar archivo</a>`;
        }

        div.innerHTML = `<strong>${tarea.nombre}</strong><br>${contenido}`;
        lista.appendChild(div);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = nombreInput.value.trim();
      const archivo = archivoInput.files[0];

      if (!archivo) {
        mensaje.textContent = "⚠️ Debes seleccionar un archivo.";
        mensaje.style.color = "#f55";
        return;
      }

      const lector = new FileReader();
      lector.onload = function (e) {
        const base64 = e.target.result;
        const tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

        tareas.push({
          nombre: nombre || archivo.name,
          archivoBase64: base64
        });

        localStorage.setItem("tareas", JSON.stringify(tareas));
        mensaje.textContent = "✅ Tarea guardada correctamente.";
        mensaje.style.color = "#20c997";
        form.reset();
        mostrarTareas();
      };

      lector.readAsDataURL(archivo); // Leer archivo como base64
    });

    mostrarTareas(); // Mostrar tareas al cargar
  });



