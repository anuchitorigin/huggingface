/**
 *  Project:      AR Finance
 *  Program:      Data and Report Backend
 *  Description:  For managing master data and report
 *  Version:      1.0
 *  Updated:      2 Feb 2024
 *  Programmer:   Mr. Anuchit Butkhunthong
 *  E-mail:       anuchit.b@origin55.com
 *  Update Information:
 *    * Version  1.0.0 (2 Feb 2024)
 *      - Prepare for V1
 */

//################################# INCLUDE #################################
//---- System Modules ----
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
// import https from 'https';
// import fs from 'fs';

//---- Application Modules ----
/* Engines Group */
// import env from './engines/env';
import { getNowFormat } from './engines/originutil';

/* Routes Group */
import hf from './routes/hf';

//################################# DECLARATION #################################
const app: Express = express();
const appver: string = 'v1.1.20240804';
const port: number = 8008;
// const port: number = 80;
const corsOptions: cors.CorsOptions = {
  // -- Default --
  // origin: "*",
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // preflightContinue: false,
  // optionsSuccessStatus: 204
  // -- Custom Configuration --
  // "origin": ["http://localhost:50000", "http://localhost:8100","http://qrsys.app", "http://neolix.app"],
};

//################################# ROUTE #################################
/* CORS policy (to get rid of "No 'Access-Control-Allow-Origin'") */
app.use(cors(corsOptions));
/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));
/* parse application/json  */
app.use(bodyParser.json());
/* middleware that is specific to this router */
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('['+getNowFormat('th', 'Asia/Bangkok')+'] '+req.method+' '+req.originalUrl);
  next();
});

/* define the HOME route */
app.get('/', (req: Request, res: Response) => {
  res.send(`This is BA_CHAT API endpoint. (Build: ${appver})`);
});

// ---- API endpoints ----
/* Service Group */
app.use('/hf', hf);

/* Test Group */
// app.use('/test', test);

//################################# MAIN #################################
// -- Main Loop --
// const MainLoop = async () => {
//   await Create_Trip_Auto();
//   setImmediate(MainLoop);
// }
// setImmediate(MainLoop);

// -- Start Server ...
// Create a NodeJS HTTPS listener that points to the Express app.
// Use a callback function to tell when the server is created.
// To create self-signed SSL for development
// > openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365
// https
//   .createServer(
//     // Provide the private and public key to the server by reading each
// 		// file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync('key.pem'),
//       cert: fs.readFileSync('cert.pem'),
//       passphrase: env.ssl_passphrase,
//     },
//     app
//   )
//   .listen(port, () => {
//   console.log(`<<< Welcome to BA_AUTH API backend. (Build: ${appver}) >>>`);
//   console.log('['+getNowFormat('th', 'Asia/Bangkok')+'] '+`Listening on port ${port}`);
// });
http
  .createServer(app)
  .listen(port, () => {
  console.log(`<<< Welcome to BA_CHAT API backend. (Build: ${appver}) >>>`);
  console.log('['+getNowFormat('th', 'Asia/Bangkok')+'] '+`Listening on port ${port}`);
});

//################################# END OF MAIN PROGRAM #################################