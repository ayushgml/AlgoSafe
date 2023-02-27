const express = require( 'express' );
const router = express.Router();
const userController = require( '../controllers/userController' );

router.post( '/signup', userController.signUp );
router.post( '/login', userController.login );
router.post( '/savePassword', userController.savePassword );
router.post( '/getSavedPasswords', userController.getSavedPasswords );
router.post( '/deletePassword', userController.deletePassword );
router.get( '/', ( req, res ) => {
  res.send( 'This is AlgoSafe API' );
});

module.exports = router;