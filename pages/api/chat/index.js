// import { readFile } from 'fs/promises';
// import path from 'path';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { prompt } = req.body;
//   if (!prompt || typeof prompt !== 'string') {
//     return res.status(400).json({ message: 'Invalid prompt format' });
//   }

//   const filePath = path.join(process.cwd(), 'data', 'chat.json');

//   try {
//     const fileContent = await readFile(filePath, 'utf8');
//     // const chat = JSON.parse(fileContent);
// const chat = JSON.parse(fileContent);


//     const match = chat.find(item =>
//       item.question.toLowerCase().includes(prompt.toLowerCase())
//     );

//     const answer = match?.answer || "Sorry, I don't know that yet.";
//     res.status(200).json({ answer });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// }