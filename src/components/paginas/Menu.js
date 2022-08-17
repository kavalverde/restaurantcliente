import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';

import Platillo from '../ui/Platillo';

const Menu = () => {

    //definir el state para los platillos
    const  [platillos, guardarPlatillos] = useState([]);
    
    const { firebase } = useContext(FirebaseContext);
    

    //consultar BD al cargar
    useEffect(() => {
        const obtenerPlatillos = () => {
            firebase.db.collection('productos').orderBy('categoria').onSnapshot(manejarSnapshot);

        }
        obtenerPlatillos();
    }, []);

    //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
    function manejarSnapshot(snapshot) {
        const platillos = snapshot.docs.map(doc => {
            return{
                id: doc.id,
                ...doc.data()
            }
        });

        //Almacenar resultados en state 
        guardarPlatillos(platillos);

        //filtros
    const filtroCategoria = platillos.filter((platillo)=>platillo.categoria == 'bebida')

    }
    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Menú</h1>
            <Link to="/nuevo-platillo" className="ml-3 bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
                Agregar Platillo
            </Link>
            
            {platillos.map( (platillo) => (
                <Platillo
                    key={platillo.id}
                    platillo={platillo}
                />
            ))}
        </>
     );
}
 
export default Menu;