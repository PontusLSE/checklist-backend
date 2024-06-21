const express = require('express');
const router = express.Router();
const Checklist = require('../models/Checklist');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  const checklists = await Checklist.find();
  res.json(checklists);
});

router.get('/:id', async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);
  res.json(checklist);
});

router.post('/', async (req, res) => {
  const checklist = new Checklist(req.body);
  await checklist.save();
  res.status(201).json(checklist);
});

router.put('/:id', async (req, res) => {
  const checklist = await Checklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(checklist);
});

router.delete('/:id', async (req, res) => {
  await Checklist.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

router.post('/duplicate/:id', async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);
  const newChecklist = new Checklist({ ...checklist.toObject(), _id: mongoose.Types.ObjectId() });
  await newChecklist.save();
  res.status(201).json(newChecklist);
});

router.get('/:id/pdf', async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText(checklist.title, { x: 50, y: 350 });
  checklist.items.forEach((item, index) => {
    page.drawText(`${index + 1}. ${item.text}`, { x: 50, y: 330 - index * 20 });
  });
  const pdfBytes = await pdfDoc.save();
  res.contentType('application/pdf');
  res.send(pdfBytes);
});

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;
