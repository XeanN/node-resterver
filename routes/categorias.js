const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearCategoria, 
        ObtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId, existeUsuarioPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');
const router = Router();

/**
 * {{ url }}/api/categorias
*/

// Obtener todas las categorias - publico
router.get( '/', ObtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [ 
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], crearCategoria);

// Actualizar por id - privado - cualquiera con tokenb válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria );

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,borrarCategoria);


module.exports = router;