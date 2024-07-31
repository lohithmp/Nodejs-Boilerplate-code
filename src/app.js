import express from 'express';
import cors from 'cors';
import routes from './routes/v1/index.js';
import passport from './config/passport.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/api/v1', routes);

export default app;
