import express from 'express';
import authorize from '../middleware/authorize';

const router = express.Router();

router.get('/', authorize('read'), get_data);
router.post('/', authorize('create'), create_data);
router.put('/:id', authorize('update'), update_data);
router.delete('/:id', authorize('delete'), delete_data);

export default router;