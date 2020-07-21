import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

//Acessar a pasta de uploads para que as imagens carreguem.
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(9696);