const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, 
        crearProducto,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole } = require('../middlewares/validar-roles');

const { existeProductoPorId} = require('../helpers/db-validators');
const { existeCategoriaPorId} = require('../helpers/db-validators');


const router = Router();



/**
 * {{ url }}/api/productos
*/

// Obtener todos los productos - publico
router.get('/', obtenerProductos );


// Obtener un producto por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto );


// Crear Productos - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar un producto
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );



// Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);

module.exports = router;