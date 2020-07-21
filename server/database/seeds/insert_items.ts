import Knex from 'knex';

export async function seed(knex: Knex)
{
    await knex('item').insert([

        { title: 'Lampadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Pápeis e Papelao', image: 'papeis-papelao.svg' },
        { title: 'Résiduos Eletronicos', image: 'eletronicos.svg' },
        { title: 'Résiduos Organicos', image: 'organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' },

    ]);
}