//################################# INCLUDE #################################
//---- System Modules ----
import express, { Router, Request, Response } from 'express';
import multer from 'multer';

//---- Application Modules ----
import env from '../engines/env';
import { xString, xNumber, isData, sendObj } from '../engines/originutil';
// import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(env.HUGGINGFACEHUB_API_KEY);

//################################# DECLARATION #################################
const _THIS_filename = 'hf.ts';

const DEF_MAX_TOKENS = 100;
const A_MEGA = 1000000;

const storage = multer.memoryStorage()
const uploadfile = multer({ storage: storage });

//################################# FUNCTION #################################


//################################# ROUTE #################################
const router: Router = express.Router();

/* define the HOME route */
router.get('/', (req: Request, res: Response) => {
  res.send('This is -Hugging Face- API endpoint.');
});

/* define the Chat route */
router.post('/chat', async (req: Request, res: Response) => {
  /**
   *  Request:-
   *    {
   *      model: string, 
   *      max_tokens: number, // default = null
   *      messages: [
   *        {
   *          role: string,
   *          content: string
   *        }
   *      ],
   *    }
   *  Response:-
   *    {
   *      status: 1,
   *      message: "ok",
   *      result: [
   *        {
   *          role: string,
   *        }
   *      ]
   *    }
   */
  // const userid = xString(res.locals.userid);
  let model = req.body.model;
  let max_tokens = req.body.max_tokens;
  let messages = req.body.messages;
  if (!(model && Array.isArray(messages))) {
    sendObj(3, 'Insufficient required fields', [], res);
    return;
  }
  model = xString(model);
  if (!max_tokens) {
    max_tokens = DEF_MAX_TOKENS;
  }
  let rowno = 0;
  for (const message of messages) {
    rowno++;
    if (!(message.role && message.content)) {
      sendObj(3, 'Insufficient required fields (rowno='+rowno+')', [], res);
      return;
    }
  }
  // Chat completion API
  const output = await inference.chatCompletion({
    model: model, // "mistralai/Mistral-7B-Instruct-v0.2",
    max_tokens: max_tokens,
    messages: [{ 
      role: messages[0].role, // "user", 
      content: messages[0].content, // "Complete this sentence with words one plus one is equal " 
    }],
  });
  // console.log(output.choices[0].message);
  // -- Event Log
  // await add_log_user(userid, K_log_incident.BOM_ADD, JSON.stringify({
  //   id: id,
  // }));
  // -- Done
  sendObj(1, 'ok', [output.choices[0].message], res);
});

/* define the Translation route */
router.post('/translate', async (req: Request, res: Response) => {
  /**
   *  Request:-
   *    {
   *      model: string, // null = let the HF recommend
   *      inputs: string
   *    }
   *  Response:-
   *    {
   *      status: 1,
   *      message: "ok",
   *      result: [
   *        {
   *          "translation_text": "Traduire ceci en thaï: Je vais bien"
   *        }
   *      ]
   *    }
   */
  // const userid = xString(res.locals.userid);
  let model = req.body.model;
  let inputs = req.body.inputs;
  if (!(inputs)) {
    sendObj(3, 'Insufficient required fields', [], res);
    return;
  }
  inputs = xString(inputs);
  // You can also omit "model" to use the recommended model for the task
  const output = await inference.translation({
    model: model, // 't5-base',
    inputs: inputs, // 'My name is Wolfgang and I live in Amsterdam'
  });
  // console.log(output);
  // -- Event Log
  // await add_log_user(userid, K_log_incident.BOM_ADD, JSON.stringify({
  //   id: id,
  // }));
  // -- Done
  sendObj(1, 'ok', [output], res);
});

/* define the Image-to-Text route */
router.post('/imagetotext', uploadfile.single('data'), async (req: Request, res: Response) => { 
  /**
   *  Request:- (form-data)
   *    {
   *      model: string,
   *      data: file
   *    }
   *  Response:-
   *    {
   *      status: 1,
   *      message: "ok",
   *      result: [
   *        {
   *          generated_text: "a white and black sheep with a black face "
   *        }
   *      ]
   *    }
   */
  // const userid = xString(res.locals.userid);
  let model = req.body.model;
  const file: any = req.file;
  if (!(model && file)) {
    sendObj(3, 'Insufficient required fields', [], res);
    return;
  }
  model = xString(model);
  // const originalname = xString(file.originalname);
  // const mimetype = xString(file.mimetype); 
  // const size = xNumber(file.size); 
  const buffer = file.buffer;
  // if (!mimetype.startsWith('image')) {
  //   sendObj(1000, 'File is not an image', [], res);
  //   return;
  // }
  // const content_size_limit = env.content_size_mb * A_MEGA;
  // if (size > content_size_limit) {
  //   sendObj(1001, 'File size is too big', [], res);
  //   return;
  // }
  const output = await inference.imageToText({
    model: model, // 'nlpconnect/vit-gpt2-image-captioning',  
    data: buffer, // await (await fetch('https://picsum.photos/300/300')).blob(),
  });
  // console.log(output);
  // -- Event Log
  // const logdetail = JSON.stringify({
  //   bucketid: bucketid,
  // });  
  // await add_log_user(userid, K_log_incident.CONTENT_ADD, logdetail);
  // -- Done
  sendObj(1, 'ok', [output], res);
});

/* define the Text-to-Image route */
router.post('/texttoimage', uploadfile.single('data'), async (req: Request, res: Response) => { 
  /**
   *  Request:- (form-data)
   *    {
   *      model: string,
   *      inputs: string,
   *      parameters: any
   *    }
   *  Response:-
   *    {
   *      status: 1,
   *      message: "ok",
   *      result: [
   *        {
   *          generated_image: <Base64>
   *        }
   *      ]
   *    }
   */
  // const userid = xString(res.locals.userid);
  let model = req.body.model;
  let inputs = req.body.inputs;
  let parameters = req.body.parameters;
  if (!(model && inputs)) {
    sendObj(3, 'Insufficient required fields', [], res);
    return;
  }
  model = xString(model);
  inputs = xString(inputs);
  const blob = await inference.textToImage({
    model: model, // 'stabilityai/stable-diffusion-2',
    inputs: inputs, // 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
    parameters: parameters, // {negative_prompt: 'blurry'},
  });
  const buffer = await blob.arrayBuffer();
  const buffer64 = Buffer.from(buffer).toString('base64');
  // console.log(output);
  // -- Event Log
  // const logdetail = JSON.stringify({
  //   bucketid: bucketid,
  // });  
  // await add_log_user(userid, K_log_incident.CONTENT_ADD, logdetail);
  // -- Done
  // res.send(Buffer.from(buffer64));
  sendObj(1, 'ok', [{
    generated_image: buffer64,
  }], res);
});

export default router;