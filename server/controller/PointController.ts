import knex from '../database/connection';
import { Request, Response } from 'express';

class PointController {

    async create(request: Request, response: Response) {

        const {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            UF,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        
        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            UF
        };

        const insertedId = await trx('point').insert(point);
    
        const point_id = insertedId[0];
    
        const pointItem = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        });
    
        await trx('point_item').insert(pointItem);
        
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    
    }

    async index(request: Request, response: Response) {

        const { city, UF, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const points = await knex('point')
            .join('point_item', 'point_id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id', parsedItems)
            .where('city', String(city))
            .where('UF', String(UF))
            .distinct()
            .select('point.*');
        
        return response.json(points);

    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const point = await knex('point').select('*')
            .where('id', id)
            .first();
        
        if (!point){
            return response.status(400).json({ message: 'Ponto de Coleta nao encontrado!' });
        }

        const items = await knex('item')
            .join('point_item', 'item.id', '=', 'point_item.item_id')
            .where('point_item.point_id', id)
            .select('item.title');

        return response.json({ point, items });

    }

}

export default PointController;