import Tecnico from '../../public/imgs/tecnico.png';

export default function PortAcademico(){
    return(
        <div>
            <div className="header">
                <ul>
                     <li><a href="">Inicio</a></li>
                     <li><a href="">Quien es?</a></li>
                     <li><a href="">Habilidades tecnicas</a></li>
                     <li><a href="">Esperiencia en lenguajes de programacion</a></li>
                     <li><a href="">Contacto</a></li>
                     <li><a href="">Sesión</a></li>
                     <li><a href="" className="btn btn-home"> Volver</a></li>
                </ul>


                <div className="titulo" >
                    <div className="foto">
                            <img src={Tecnico} alt="foto"/>
                    </div>


                   <h1> WILMER AGUIRRE BEJARANO</h1>
                </div>
            </div>

            <div className="cuerpo">
                <div className="divicion">
                    <div className="subtitulo">
                        <h2>QUIEN ES WILMER ??</h2>
                     </div>
                    <p>
                        Wilmer un desarollador de sofware, con experiencia en Java, C# y desarollo movil con android studio.
                        fue participe de talleres se contabilidad basica,intermedia.
                        Para ver en los projectos que fue trabajando , direccionarse al repositori de GIT HUB y encontraran
                        de c# en entorno grafico,programacion movil con kotlin.
                    </p>
                </div>

                <div className="divicion">

                     <div className="subtitulo">
                        <h2>HABILIDADES TECNICAS</h2>
                    </div>
                    <h3>
                        LENGUAJES DE PROGRAMACION
                    </h3>
                    {/* <p>Java intermedio <i className="fa-brands fa-java" style="color: rgb(255, 255, 255); size:50px;"></i></p>
                    <p>CSS <i className="fa-brands fa-css3-alt" style="color: rgb(255, 255, 255);"></i></p>
                    <p>Git hub <i className="fa-brands fa-github" style="color: rgb(255, 255, 255);"></i></p>
                    <p>React  <i className="fa-brands fa-react" style="color: rgb(255, 255, 255);"></i></p>
                    <p>Java Script <i className="fa-brands fa-node-js" style="color: rgb(255, 255, 255);"></i></p>
                    <p>Kotlin <i className="fa-brands fa-android" style="color: rgb(255, 255, 255);"></i></p>
                    <p>Payton <i className="fa-brands fa-python" style="color: rgb(255, 255, 255);"></i></p> */}

                    <h3>Progectos Realizados</h3>
                    <img src={Tecnico} alt="fotografia del técnico"/>
                    <p>CNC" tiene múltiples significados; puede referirse a la tecnología de Control Numérico Computarizado para el mecanizado de materiales, a la Cámara Nacional de Comercio en Bolivia, o a la abreviatura en inglés Consensual Non-Consent (juego de rol), que significa "no consentimiento consensuado". Para entender a qué "cnc" te refieres, es necesario conocer el contexto. </p>

                </div>
                <div className="divicion">
                    <div className="subtitulo">
                        <h2>CONTACTOS</h2>
                     </div>

                    wilmer Aguirre Bejarano
                    Cel:68188274
                    wilmeraguirrebejarano@gmail.com
                    {/* wilmer-aguirre-bejarano <i className="fa-brands fa-github" style="color: rgb(255, 255, 255);"></i> */}

                </div>
            </div>
        </div>
    );
}