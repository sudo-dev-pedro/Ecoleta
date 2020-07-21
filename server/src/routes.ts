import express from 'express';

import PointController from '../controller/PointController';
import ItemController from '../controller/ItemController';

const pointController = new PointController();
const itemController = new ItemController();

const routes = express.Router();

routes.get('/items', itemController.index);

routes.post('/points', pointController.create);
routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

export default routes;

