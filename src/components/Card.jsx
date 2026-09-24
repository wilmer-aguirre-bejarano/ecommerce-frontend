export default function Card({children, ...props}){
    return(
        <div className="custom-card"{...props  }>    {/*Se añade className="custom-card" para poder estilizarlo en css igualque otros componentes */}
            {children}
        </div>
    );
}
