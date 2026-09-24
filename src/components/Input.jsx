//src/components/Imput.jsx

//Resivimos las entradas(parametros):label(el texto de ariba) y port(type, value, onChanget, ect.) 

export default function Input({label, type, value, onChange, required}){
    return(
        <div className="input-group">
            {/*1 En trada de datos visuales: El texto decorativo*/}
            {label && <label className="input-label">{label}</label>}
            {/* 2. Entrada/Salida de datos interactiva: El cuadro de texto real */}
            <input className="custom-input" type={type} value={value} onChange={onChange} required={required}/>

            <br />
        </div>
    );
}
