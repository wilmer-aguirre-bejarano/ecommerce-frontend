
//scr/components/Button.jsx
//1. Recibimos "children"(el texto de adentro)y "....props" ()
export default function Button({children, ...props  }){
    return(
        <button className="custom-button" {...props}>            {/*...props=> onClick, type, disabled, style //Es como decir: "pásale al <button> del DOM todos los atributos que no mencioné explícitamente" */}
            {children} {/*child => lo que contenga*/ }
        </button>
    );
}