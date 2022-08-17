import React, {useContext, useRef} from 'react';
import { FirebaseContext } from '../../firebase';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const Platillo = ({platillo}) => {

    //borrar usuario
    const BorrarPlatillo = () => {
        swal({
            title: "¿Estás seguro?",
            text: "Una vez borrado, no podrás recuperar el platillo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                try {
                    firebase.db.collection('productos')
                    .doc(id)
                    .delete()
                    swal("El platillo ha sido eliminado", {
                        icon: "success",
                      });
                } catch (error) {
                    console.log(error);
                }

            } else {
              swal("El platillo no ha sido eliminado");
            }
          });
    }
    //Existencia ref para acceder al valor directamente
    const existenciaRef = useRef(platillo.existencia);

    //context de firebase para cambios en la BD
    const { firebase } = useContext(FirebaseContext)

    const {id, nombre, imagen, existencia, categoria, precio, descripcion} = platillo;



    //modificar el estado del platillo en firebase
    const actualizarDisponibilidad = () => {

        const existencia = (existenciaRef.current.value === "true");

        try {
            firebase.db.collection('productos')
            .doc(id)
            .update({
                existencia
            });
        } catch(error) {
            console.log(error);
        }

    }

    return ( 
        <div className="w-full px-3 mb-4">
            <div className ="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <img src={imagen} alt="Imagen Platillo"/>

                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-2/4">
                                <span className="block text-gray-800 mb-2">Existencia</span>
                                <select 
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        value={existencia}
                                        ref={existenciaRef}
                                        onChange={ () => actualizarDisponibilidad() }
                                    >
                                    <option value="true">Disponible</option>
                                    <option value="false">No disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 xl:w-9/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre}</p>
                        <p className="text-gray-600 mb-4">Categoría: {''}
                            <span className="text-gray-700 font-bold">{categoria.toUpperCase()}</span></p>
                        <p className="text-gray-600 mb-4">{descripcion}</p>
                        <p className="text-gray-600 mb-4">Precio: {''}
                            <span className="text-gray-700 font-bold">${precio}</span></p>
                    </div>
                    <div >
                        <div>
                            <Link to={`/editar-platillo/${id}`} className="ml-3 bg-gray-600 hover:bg-gray-700 inline-block mb-4 p-1 text-white uppercase font-bold text-center mt-5">
                                Editar Platillo
                            </Link>
                        </div>
                        <div>
                            <button className="ml-7 bg-red-700 hover:bg-red-600 inline-block mb-5 p-3 text-white uppercase font-bold"
                                onClick={()=>BorrarPlatillo()}
                            >
                                Borrar
                            </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Platillo;