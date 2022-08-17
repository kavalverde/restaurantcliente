import React, { useContext, useState, useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import  {FirebaseContext} from '../../firebase'
import { useNavigate, useParams } from 'react-router-dom';
import FileUploades from 'react-firebase-file-uploader';
import swal from 'sweetalert';

const Editarplatillo = () => {
    
     //Todo para BD de platillo
     const  [platillos, guardarPlatillos] = useState([]);
    //consultar BD al cargar
        useEffect(() => {
                const obtenerPlatillos = () => {
                firebase.db.collection('productos').onSnapshot(manejarSnapshot);

            }
            obtenerPlatillos();
        }, []);

        //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
        function manejarSnapshot(snapshot) {
            const platillos = snapshot.docs.map(doc => {
                return{
                    id: (doc.id),
                    ...doc.data()
                }
            });
            guardarPlatillos(platillos);
            console.log(platillos)
        }
        const {id} = useParams();


    //Elementos
    const verificarPlatillo = platillos.filter((platillo)=>platillo.id == id)
  
    const listItems = verificarPlatillo.map((number) =>number.nombre)
    console.log(listItems)
    const elementoNombre = verificarPlatillo.map((platillo) =>platillo.nombre)
    const elementoPrecio = verificarPlatillo.map((platillo) =>platillo.precio)
    const elementoCategoria = verificarPlatillo.map((platillo) =>platillo.categoria)
    const elementoImagen = verificarPlatillo.map((platillo) =>platillo.imagen)
    const elementoDescripcion = verificarPlatillo.map((platillo) =>platillo.descripcion)

    //state para las imagenes
    const [subiendo, guardarSubiendo] = useState(false)
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlimagen] = useState('');


    //context on las operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    //Hook para redireccionar
    const navigate = useNavigate();
    //validación y leer datos del formulario
    const formik = useFormik({
        initialValues: {
           nombre:  '',
           precio: '',
           categoria: '',
           imagen: '',
           descripcion: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .min(3, 'Los Platillos deben tener al menos 3 caracteres'),
            precio: Yup.number()
                        .min(1, 'Debes agregar un número'),
            categoria: Yup.string(),
            descripcion: Yup.string()
                        .min(10, "La descripción debe ser más larga")
        }),
        onSubmit: datos => {
            swal({
                title: "¿Estás seguro?",
                text: "Estás a punto de modificar el platillo: " + elementoNombre,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willUpdate) => {
                if (willUpdate) {
                    datos.imagen = urlimagen;
                    try {
                        if(datos.nombre !==''){
                            firebase.db.collection('productos')
                                .doc(id)
                                .update({nombre:datos.nombre})
                        }
                        if(datos.precio !==''){
                            firebase.db.collection('productos')
                                .doc(id)
                                .update({precio:datos.precio})
                        }
                        if(datos.categoria !==''){
                            firebase.db.collection('productos')
                                .doc(id)
                                .update({categoria:datos.categoria})
                        }
                        if(datos.imagen !==''){
                            
                            firebase.db.collection('productos')
                                .doc(id)
                                .update({imagen:datos.imagen})
                        }
                        if(datos.descripcion !==''){
                            firebase.db.collection('productos')
                                .doc(id)
                                .update({descripcion:datos.descripcion})
                        }
                        swal("El platillo ha sido modificado", {
                            icon: "success",
                          });
                        //redireccionar
                        navigate('/menu')
                        }catch (error) {
                            console.log(error);
                        }
                }else {
                    swal("El platillo no ha sido modificado");
                  }
                }); 
        }
    })
    
    //Todo sobre imagenes
    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }
    const handleUploadError = error => {
        guardarSubiendo(false);
        console.log(error);
    }
    const handleUploadSuccess = async nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);

        //Almacenar la URL de destino
        const url = await firebase
                    .storage
                    .ref("productos")
                    .child(nombre)
                    .getDownloadURL();

        console.log(url);
        guardarUrlimagen(url);
    }
    const handleProgress = () => {
        guardarProgreso(progreso);

        console.log(progreso);
    }


    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Modificar Platillo</h1>
            <p className="italic text-xl ">Por favor, ingrese únicamente los datos que desea modificar</p>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl ">
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder={elementoNombre}
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                Precio</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                step="any"
                                type="number"
                                placeholder={elementoPrecio}
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                                Categoría</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria"
                                name="categoria"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" selected disabled hidden>{elementoCategoria}</option>
                                <option value="desayuno">Desayuno</option>
                                <option value="comida">Comida</option>
                                <option value="cena">Cena</option>
                                <option value="bebida">Bebida</option>
                                <option value="postre">Postre</option>
                                <option value="ensalada">Ensalada</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                        { formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">
                                Imagen</label>
                                <p className="text-red-600 font-semibold">Imagen actual</p>
                                <img className="lg:w-5/12 xl:w-3/12" src={elementoImagen} />
                                <p className="font-semibold text-blue-600 pt-5">Seleccione nueva imagen</p>
                            <FileUploades
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>
                        { subiendo && (
                            //quitar relative para barra en cabecera
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{width: `${progreso}%`}}>
                                    {progreso} %
                                </div>
                            </div>
                        )}
                        {urlimagen && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                La imagen se subió correctamente
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                                Descripción</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="descripcion"
                                placeholder={elementoDescripcion} 
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>
                        { formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Modificar Platillo"
                        />
                    </form>
                </div>
            </div>
        </>
     );
}
 
export default Editarplatillo;