const express = require('express')
const {getUserId,updateUser,getAllUser,deleteUser,countUser} = require('../controllers/user_controllers')



const router = express.Router();


router.get('/api/users/:id',getUserId);
router.put('/api/users/:id',updateUser);
router.get('/api/users',getAllUser);
router.delete('/api/users/:id',deleteUser);
router.get('/api/userscount',countUser);


module.exports = router;