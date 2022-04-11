/**
 * Consulta API  Total
 */
async function fetchApiTotal() {
  try{
    const response = await fetch('http://localhost:3000/api/total');
    
    const total = await response.json();

    return total;
  }
  catch(err){
    console.log(`Error: ${err}`);
  }
}

/**
 * Consulta API por pais
 */

 async function fetchApiPais(pais) {
  try{
    const response = await fetch(`http://localhost:3000/api/countries/${pais}`);
    
    const total = await response.json();

    return total;
  }
  catch(err){
    console.log(`Error: ${err}`);
  }
}

function charting(datos){  

  const result = datos.data.filter(country => country.confirmed > 1000000);

  const ctx = document.getElementById('myChart').getContext('2d');

  var xCountry = [];
  var yConfirmed = [];
  var yDeaths = [];
  var yRecovered = [];
  var barColors = ['red', 'green', 'blue'];
  

  result.forEach(element => {
    xCountry.push(element.location);
    yConfirmed.push(element.confirmed);
    yDeaths.push(element.deaths);
    yRecovered.push(element.recovered);
  });



  new Chart("myChart", {
    type: 'bar',
    data: {
      labels: xCountry,
      datasets: [
        {
          label: 'Confirmados',
          backgroundColor: barColors[0],
          data: yConfirmed
        },
        {
          label: 'Muertes',
          backgroundColor: barColors[1],
          data: yDeaths
        },
        {
          label: 'Recuperados',
          backgroundColor: barColors[2],
          data: yRecovered
        }
      ]
    },
    options: {
      legend: {position: 'top'},
      title: {
        display: true,
        text: "Covid 19 - Paises con mas de 1 millón de casos confirmados"
      }
    }
  });
}

const fillTable = (data, table) => {
  let rows = "";
  $.each(data.data, (i, row) => {
    
    
      rows += `<tr>
  <td> ${row.location} </td>
  <td> ${row.confirmed} </td>
  <td> ${row.deaths} </td>
  <td><a id="${row.location}" type="button" class="btn btn-success detalle" data-bs-toggle="modal" data-bs-target="#exampleModal">Detalle</a></td>
  </tr>`

  })
  $(`#${table}`).append(rows);
}
/**
 * levantar el modal
 */
function verDetalle(){
  $(".detalle").click(async function(e){
    
    //Estado inicial del modal
    $("#exampleModalLabel").text(`Detalle de ...`);
    $("#modalBody").html(`<p>Cargando ...</p>`);

    let country = e.target.id;
    country = country.replace(/ /g, "_")
    
    const datos = await fetchApiPais(country);
    
    $("#exampleModalLabel").text(`Detalle de ${country}`);
    $("#modalBody").html(`<p>Confirmados: ${datos[country].confirmed}</p><p>Muertes: ${datos[country].deaths}</p><p>Recuperados: ${datos[country].recovered}</p>`);
    
  });
}

// Valida usuario y contraseña desde API. En caso de ser exitoso genera token

const postData = async(email, password) => {
  try {
      const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          body: JSON.stringify({ email: email, password: password })
      })
      const { token } = await response.json();
      localStorage.setItem('jwt-token', token);
      return token
  } catch (err) {
      console.error(`Error: ${err}`);
  }
}

$("#btnLogin").click(async function(e){
  e.preventDefault();
  let email = $("#inputEmail").val();
  let pass = $("#inputPassword").val();
  $("#staticBackdrop").modal('show');

  $("#loginModal").hide();
  
  const JWT = await postData(email, pass);

  toggleTotalAndChile("total","chile");

  
  let confirmed = await getInfoChile(JWT, "confirmed");
  let deaths = await getInfoChile(JWT, "deaths");
  let recovered = await getInfoChile(JWT, "recovered");
  
  graficoChile(confirmed, deaths, recovered, "chile");
  $("#staticBackdrop").modal('hide');
  btnCerrar();
  
});

function btnCerrar(){
  $("#iniciarBtn").toggle();
  $("#iniciarLi").append(`<a id="cerrarBtn" class="nav-link mx-1 menu-item active" href="#">Cerrar Sesion</a>`);
  
  $("#cerrarBtn").click(function(e){
    localStorage.clear();
    $("#cerrarBtn").hide();
    $("#iniciarBtn").toggle();
    toggleTotalAndChile("total", "chile");
  });
}

const getInfoChile = async(jwt, info) => {
  try{
    const response = await fetch(`http://localhost:3000/api/${info}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt} `
        }
    })
    const { data } = await response.json();
    return data;
  }
  catch(err){
    console.error(`Error: ${err}`);
  }
}

// Rellenar tabla con datos

const graficoChile = (confirmed, deaths, recovered, div) => {
  
  let fechas = [];
  let confirmados = [];
  let muertos = [];
  let recuperados = [];
  
  //confirmados y fechas
  $.each(confirmed, (i, row) => {
    fechas.push(row.date);
    confirmados.push(row.total);
  });

  //muertes
  $.each(deaths, (i, row) => {
    muertos.push(row.total);
  });

  //recuperados
  $.each(recovered, (i, row) => {
    fechas.push(row.date);
    recuperados.push(row.total);
  });

  graficarChile(fechas, confirmados, muertos, recuperados);
  
}

function graficarChile(fechas, confirmados, muertos, recuperados){
  $("#chile").html(`<canvas id="graphChile" class="mx-auto my-5"></canvas>`);
  const ctx = document.getElementById('graphChile').getContext('2d');
  
  const data = {
    labels: fechas,
    datasets: [
      {
        label: 'Confirmados',
        data: confirmados,
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      },
      {
        label: 'Muertos',
        data: muertos,
        fill: false,
        borderColor: 'red',
        tension: 0.1
      },
      {
        label: 'Recuperados',
        data: recuperados,
        fill: false,
        borderColor: 'green',
        tension: 0.1
      }
    ]
  };
  const config = {
    type: 'line',
    data: data
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
    legend: {position: 'top'},
    title: {
        display: true,
        text: "Covid 19 en Chile"
      }
    }
  });
}

function loading(){
  $("#cargando").toggle();
}

const toggleTotalAndChile = (total, chile) => {
  $(`#${total}`).toggle() // cambia el display none a block o de block a none, dependiendo el estado que tiene
  $(`#${chile}`).toggle()
}

// Comprobacion token al iniciar
const init = async() => {
  const token = localStorage.getItem('jwt-token');

  if(token){
    $("#staticBackdrop").modal('show');

    $("#loginModal").hide();

    toggleTotalAndChile("total","chile");

  
    let confirmed = await getInfoChile(token, "confirmed");
    let deaths = await getInfoChile(token, "deaths");
    let recovered = await getInfoChile(token, "recovered");

    graficoChile(confirmed, deaths, recovered, "chile");
    $("#staticBackdrop").modal('hide');
    btnCerrar();

  }
}

const datos = await fetchApiTotal();
charting(datos);
fillTable(datos, "tablaTotal");
verDetalle();
init();