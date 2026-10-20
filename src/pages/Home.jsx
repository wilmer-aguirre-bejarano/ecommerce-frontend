import React from 'react';
import imgMadera from '../../public/imgs/imgArticuloMadera.webp';

export default function Home(){
    return(
        <div className="home-container">
            <section className="hero-portada">
                <div className="hero-contenido">
                    <h1>Bienvenido a mi sitio web</h1>
                    <img src={imgMadera} alt="imagen de productos de madera" />
                    <p>Diseña experiencias increíbles con React de forma rápida y sencilla.</p>
                    <button onClick={() => alert('¡Acción realizada!')}>
                        Empezar ahora
                    </button>
                </div>
            </section>
            
            
        </div>

    );
}

