/**
 *  Program:      Environment Variables for TS
 *  Description:  All variables from .env file
 *  Version:      1.0.0
 *  Updated:      4 Aug 2023
 *  Programmer:   Mr. Anuchit Butkhunthong
 *  E-mail:       anuchit.b@origin55.com
 *  Update Information:
 *    * Version  1.0.0 (4 Aug 2023)
 *      - Prepare for V1
 */

//################################# INCLUDE #################################
//---- System Modules ----
import dotenv from 'dotenv';

//---- Application Modules ----
import { xString } from './originutil';

//################################# DECLARATION #################################
dotenv.config();

const env = {
  HUGGINGFACEHUB_API_KEY: xString(process.env.HUGGINGFACEHUB_API_KEY),
}

export default env