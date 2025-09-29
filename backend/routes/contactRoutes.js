import express from 'express';
import { createContact, deleteContact, getContacts, updateContact } from "../controllers/contactControllers.js";

const contactRouter = express.Router();

contactRouter.post('/add', createContact);
contactRouter.post('/all', getContacts);
contactRouter.put('/update/:id', updateContact);
contactRouter.get('/delete/:id', deleteContact);

export default contactRouter;