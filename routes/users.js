const router = require('express').Router();

const {
  getUsers, getUser, updateUserProfile, updateUserAvatar, getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/me', updateUserProfile);

router.get('/me', getCurrentUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
