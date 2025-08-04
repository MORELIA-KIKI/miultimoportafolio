document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Login y Registro
  if (path.includes("index.html") || path.endsWith("/")) {
    const msg = (text) => (document.getElementById("message").textContent = text);

    document.getElementById("btn-register")?.addEventListener("click", () => {
      const u = document.getElementById("reg-user").value.trim();
      const p = document.getElementById("reg-pass").value.trim();
      if (!u || !p) return msg("Campos obligatorios");

      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[u]) return msg("Usuario ya registrado");

      users[u] = { pass: p, tareas: [] };
      localStorage.setItem("users", JSON.stringify(users));
      msg("Registro exitoso");
    });

    document.getElementById("btn-login")?.addEventListener("click", () => {
      const u = document.getElementById("log-user").value.trim();
      const p = document.getElementById("log-pass").value.trim();
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[u]?.pass === p) {
        localStorage.setItem("currentUser", u);
        window.location.href = "dashboard.html";
      } else {
        msg("Credenciales incorrectas");
      }
    });
  }

  // Dashboard
  if (path.includes("dashboard.html")) {
    const user = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (!user || !users[user]) {
      window.location.href = "index.html";
      return;
    }

    const logoutBtn = document.getElementById("logout");
    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });

    const form = document.getElementById("task-form");
    const taskNameInput = document.getElementById("task-name");
    const fileInput = document.getElementById("file-input");
    const taskList = document.getElementById("task-list");
    const uploadMsg = document.getElementById("upload-msg");

    function mostrarTareas() {
      const tareas = users[user].tareas || [];
      taskList.innerHTML = "";

      tareas.forEach(tarea => {
        const li = document.createElement("li");
        let contenido = "";

        if (tarea.archivo.startsWith("data:image")) {
          contenido = `<img src="${tarea.archivo}" alt="Imagen" style="max-width:100px;">`;
        } else if (tarea.archivo.startsWith("data:application/pdf")) {
          contenido = `<a href="${tarea.archivo}" target="_blank">📄 Ver PDF</a>`;
        } else {
          contenido = `<a href="${tarea.archivo}" download>⬇️ Descargar archivo</a>`;
        }

        li.innerHTML = `<strong>${tarea.nombre}</strong><br>${contenido}`;
        taskList.appendChild(li);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = taskNameInput.value.trim() || `Tarea ${users[user].tareas.length + 1}`;
      const archivo = fileInput.files[0];

      if (!archivo) {
        uploadMsg.textContent = "⚠️ Debes seleccionar un archivo.";
        uploadMsg.style.color = "#f55";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const nuevaTarea = { nombre, archivo: reader.result };
        users[user].tareas.push(nuevaTarea);
        localStorage.setItem("users", JSON.stringify(users));

        uploadMsg.textContent = "✅ Tarea agregada correctamente.";
        uploadMsg.style.color = "#20c997";
        form.reset();
        mostrarTareas();
      };
      reader.readAsDataURL(archivo);
    });

    mostrarTareas();
  }
});

