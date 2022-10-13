const formulario = document.getElementById("formulario");
const historial = [];
class conversion{
    constructor(tipoIn,numero,result,tipoOut){
        this.tipoIn = tipoIn;
        this.numero = numero;
        this.resultado = result;
        this.tipoOut = tipoOut;
    }
}


formulario.addEventListener("submit",(e) => {
    e.preventDefault(); //Se evita que el boton refresque pagina.
    //Obtengo los datos
    const Tipo = document.getElementById("Tipo").value; 
    const In = document.getElementById("In").value;
    const resultado = convertir(In,Tipo);
    const tipoOut = opuesto(Tipo);
    const operacion = new conversion(Tipo,In,resultado,tipoOut);
    //los guardo en el historial y los muestro
    historial.push(operacion);
    localStorage.setItem("historial",JSON.stringify(historial));
    mostrarResultado(operacion);
    formulario.reset(); // Para que el formulario se borre
});

const contenedorHistorial = document.getElementById("contenedorHistorial");

const verHistorial = document.getElementById("verHistorial");

verHistorial.addEventListener("click",() => {
    mostrarHistorial();
});

borrarHistorial.addEventListener("click", () =>{
    Swal.fire({
        title: "Seguro que quiere eliminar el historial?",
        icon: "warning",
        imageUrl: "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/05/07/16203887297193.jpg",
        confirmButtonText: "Aceptar",
        background: " #daea1f ",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#dd38b0"
    }).then((result) => {
        if (result.isConfirmed){
            // Elimino el historial
            localStorage.clear();
            historial.splice(0,historial.length);
            contenedorHistorial.innerHTML = "";
            Swal.fire({
                title: "Historial eliminado",
                icon: "success",
                background: "#318e8f",
                confirmButtonText: "Aceptar"
            });
        };
    });
});

function mostrarHistorial() { //Aca no estoy muy seguro que usar para mostrar el historial, por html queda medio feo.
    contenedorHistorial.innerHTML = ""; //Para que se resetee el contenedor
    const historialLocal = JSON.parse(localStorage.getItem("historial"));
    historialLocal.forEach(operacion => {
        let {tipoIn, numero, tipoOut, resultado} = operacion;
        const div = document.createElement("div");
        div.innerHTML = `
                        <div style="border: thick solid black">
                            <p>Tipo de entrada: ${tipoIn}</p>
                            <p>Numero ingresado: ${numero}</p>
                            <p>Tipo de resultado: ${tipoOut}</p>
                            <p>Numero resultado: ${resultado}</p>
                        </div>
                        `;
        contenedorHistorial.appendChild(div);
    })
};

const resultado = document.getElementById("resultado");

const mostrarResultado = (operacion) => {

    Swal.fire({
        title: "Su operacion:",
        text: `Resultado: ${operacion.tipoOut}: ${operacion.resultado}`,
        icon: "success",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQISXgxMVRt5hIeBopq16Iah_Ku3hrkj6ocdw&usqp=CAU",
        background: " #3ce737", //htmlcolorcodes.com
        backdrop: "#336fe7", //el fondo que tapa la pagina
        confirmButtonText: "Aceptar"
    });
};

// Obtengo la tasa actual del dolar blue
let tasaDolarBlue;
const criptoYa = "https://criptoya.com/api/dolar";
    fetch(criptoYa)
        .then(response => response.json())
        .then(({blue}) => {
            tasaDolarBlue = blue;
        })
        .catch(error => {Swal.fire({
            title: "No se pudo conectar a criptoYa",
            icon: "warning",
            confirmButtonText: "Aceptar"
        })});



function convertir (valor, tipo){
    let res;
    switch (tipo){
        case "Gramo":
            res = valor/453.6;
            break;
        case "Milla":
            res = valor*1609;
            break;
        case "Metro":
            res = valor/1609
            break;
        case "Libra":
            res = valor *453.6;
            break;
        case "Peso":
            res = valor / tasaDolarBlue
            break;
        case "Dolar blue":
            res = valor * tasaDolarBlue
            break;
    }
    return res;
}

function opuesto (tipo){
    let res;
    switch (tipo){
        case "Gramo":
            res = "Libra"
            break;
        case "Milla":
            res = "Metro"
            break;
        case "Metro":
            res = "Milla"
            break;
        case "Libra":
            res = "Gramo"
            break;
        case "Peso":
            res = "Dolar blue"
            break;
        case "Dolar blue":
            res = "Peso"
            break;
    }
    return res;
}