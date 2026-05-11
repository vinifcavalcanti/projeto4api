//DECLARAÇÕES DOS ELEMENTOS HTML PARA O DOM 
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida")
const canvas = document.getElementById("canvas");

//METODO LIGAR CÂMERA

async function configurarCamera(){
    try{
        //solicita a permissão para acessar a camera do usuário
        const midia = await navigator.mediaDevices.getUserMedia({
            //habilita a camera traseira do celular
            video:{facingMode: "environment"},
            audio:false
        })
        //atribui o fluxo da camera ao elemento de video para visualizar
        videoElemento.srcObject = midia;

    }catch(erro){
        resultado.innerText = "Erro ao acessar a camera", erro;
    }
}

//executa a função para habilitar camera
configurarCamera();

//Capturar e ler o texto
botaoScanear.onclick = async() => {
    //Desativa o botao para evitar multiplos cliques
    botaoScanear.disabled = true;
    resultado.innerText = "Fazendo a leitura.. Aguarde";

    //captura a imagem(foto)
    const contexto = canvas.getContext("2d");
    
    //Ajusta o tamanho do canvas interno para ser igual ao do video
    canvas.width = videoElemento.videoWidth;
    canvas.heigth = videoElemento.videoHeigth;


    //desenha o frame atual
    //do video dentro do canvas(tira a foto)
    contexto.drawImage(videoElemento,0,0,canvas,canvas.heigth);

    //processando com a api Tesseract
    try{
        //função do tesseract
        const {data:{text}} = await Tesseract.recognize(
            canvas, // a imagem que acabou de capturar
            'por', //idioma em portugues
            {longer: m => console.log(m)} // mostra no log
        )
        resultado.innerText = text.trim().length > 0 ? text : "Não foi possivel identificar o texto";

    }catch(erro){
        //resultado caso apresente um erro
        resultado.innerText = "Erro no processamento", erro.message;
    }finally{
        //habilita o botao para uma nova leitura
        botaoScanear.disabled = false;
    }
}