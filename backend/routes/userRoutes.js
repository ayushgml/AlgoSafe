const express = require( 'express' );
const router = express.Router();
const userController = require( '../controllers/userController' );

router.post( '/signup', userController.signUp );
router.post( '/login', userController.login );
router.post( '/savePassword', userController.savePassword );
router.post( '/getSavedPasswords', userController.getSavedPasswords );
router.post( '/deletePassword', userController.deletePassword );

module.exports = router;