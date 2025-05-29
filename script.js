// Cargar SheetJS para exportar a Excel
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);
let inicio, intervalo;
let datos = [];
let cronometroActivo = false;
let segundosTotales = 0;

// Cargar datos guardados al iniciar
window.onload = function () {
  const guardados = localStorage.getItem("registros");
  if (guardados) {
    datos = JSON.parse(guardados);
    datos.forEach(registro => agregarFila(registro));
  }
};

function iniciar() {
  if (cronometroActivo) {
    alert("El cronómetro ya está en marcha.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Por favor selecciona un nombre.");
    return;
  }

  segundosTotales = 0;
  document.getElementById("cronometro").textContent = "00:00:00";
  inicio = new Date();
  cronometroActivo = true;
  intervalo = setInterval(actualizarCronometro, 1000);
}

function actualizarCronometro() {
  segundosTotales++;

  const horas = Math.floor(segundosTotales / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  const formato = 
    String(horas).padStart(2, '0') + ':' +
    String(minutos).padStart(2, '0') + ':' +
    String(segundos).padStart(2, '0');

  const cronometro = document.getElementById('cronometro');
  cronometro.textContent = formato;

  // Cambiar a rojo si pasa los 8 minutos
  if (segundosTotales >= 480) {
    cronometro.style.color = 'red';
  } else {
    cronometro.style.color = 'green';
  }
}

function detener() {
  if (!cronometroActivo) return;

  clearInterval(intervalo);
  cronometroActivo = false;

  const select = document.getElementById("nombre");
  const nombre = select.value;
  const texto = select.options[select.selectedIndex].text;
  const legajo = texto.match(/\((.*?)\)/)?.[1] || "";

  const tiempo = document.getElementById("cronometro").textContent;
  const fecha = new Date().toLocaleString();
  const registro = { nombre, legajo, tiempo, fecha };

  datos.push(registro);
  localStorage.setItem("registros", JSON.stringify(datos));
  agregarFila(registro);

  document.getElementById("cronometro").textContent = "00:00:00";
  select.selectedIndex = 0;
}

function agregarFila({ nombre, legajo, tiempo, fecha }) {
  const fila = document.createElement("tr");
  fila.innerHTML = `<td>${nombre}</td><td>${legajo}</td><td>${tiempo}</td><td>${fecha}</td>`;
  document.querySelector("#tabla tbody").appendChild(fila);
}

function descargarExcel() {
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Registros");
  XLSX.writeFile(libro, "registros.xlsx");
}
