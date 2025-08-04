document.addEventListener("DOMContentLoaded"), () => {
  const path = window.location.pathname;

  // Página de login y registro
  if (path.includes("index.html") || path.endsWith("/")) {
    const msg = (text) => (document.getElementById("message").textContent = text);

    document.getElementById("btn-register")?.addEventListener("click", () => {
      const u = document.getElementById("reg-user").value.trim();
      const p = document.getElementById("reg-pass").value.trim();
      if (!u || !p) return msg("Campos obligatorios");

      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[u]) return msg("Usuario ya registrado");

      users[u] = { pass: p, tasks: [] };
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

  if (window.location.pathname.includes("dashboard.html")) {
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

  const fileInput = document.getElementById("file-input");
  const addTaskBtn = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");
  const msg = document.getElementById("upload-msg");

  const renderTasks = () => {
    const data = JSON.parse(localStorage.getItem("users") || "{}");
    const tareas = data[user]?.tasks || [];
    taskList.innerHTML = "";
    tareas.forEach((fileName, index) => {
      const li = document.createElement("li");
      li.textContent = `Tarea ${index + 1}: ${fileName}`;
      taskList.appendChild(li);
    });
  };

  addTaskBtn?.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const data = JSON.parse(localStorage.getItem("users") || "{}");
    if (!data[user].tasks) data[user].tasks = [];
    data[user].tasks.push(file.name);

    localStorage.setItem("users", JSON.stringify(data));
    msg.textContent = "¡Se subió correctamente!";
    fileInput.value = ""; // reset input
    renderTasks();
  });

  renderTasks();
}
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const taskNameInput = document.getElementById("task-name");
  const fileInput = document.getElementById("file-input");
  const taskList = document.getElementById("task-list");
  const uploadMsg = document.getElementById("upload-msg");

  function mostrarTareas() {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    taskList.innerHTML = "";

    tareas.forEach(tarea => {
      const li = document.createElement("li");

      let contenidoArchivo = "";
      if (tarea.archivo.startsWith("data:image")) {
        contenidoArchivo = `<img src="${tarea.archivo}" alt="Imagen" style="max-width:100px;">`;
      } else if (tarea.archivo.startsWith("data:application/pdf")) {
        contenidoArchivo = `<a href="${tarea.archivo}" target="_blank">📄 Ver PDF</a>`;
      } else {
        contenidoArchivo = `<a href="${tarea.archivo}" download>⬇️ Descargar archivo</a>`;
      }

      li.innerHTML = `<strong>${tarea.nombre}</strong><br>${contenidoArchivo}`;
      taskList.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = taskNameInput.value;
    const archivo = fileInput.files[0];

    if (!archivo) {
      uploadMsg.textContent = "Debes seleccionar un archivo.";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nuevaTarea = {
        nombre: nombre,
        archivo: reader.result
      };

      const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
      tareas.push(nuevaTarea);
      localStorage.setItem("tareas", JSON.stringify(tareas));

      uploadMsg.textContent = "✅ Tarea agregada correctamente.";
      form.reset();
      mostrarTareas();
    };
    reader.readAsDataURL(archivo);
  });

  mostrarTareas();
});

let taskCounter = 1;

  document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskNameInput = document.getElementById('task-name');
    const fileInput = document.getElementById('file-input');
    const taskList = document.getElementById('task-list');
    const msg = document.getElementById('upload-msg');

    const taskName = taskNameInput.value.trim() || `Tarea ${taskCounter}`;
    const file = fileInput.files[0];

    if (!file) {
      msg.textContent = "⚠️ Debes seleccionar un archivo.";
      msg.style.color = "#f55";
      return;
    }

    const li = document.createElement('li');
    li.textContent = `${taskName} - Archivo: ${file.name}`;
    taskList.appendChild(li);

    msg.textContent = "✅ Tarea agregada correctamente.";
    msg.style.color = "#20c997";

    taskCounter++;
    taskNameInput.value = "";
    fileInput.value = "";
  });
