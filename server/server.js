import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = 4000;

app.get('/api/search', (req, res) => {
  const q = req.query.q?.toLowerCase(); // Safe optional chaining

  const data = [
    "Python", "Java", "Javascript", "Django", "RESTful",
    "MongoDB", "Express", "Postgre", "Kafka", "Kubernetes"
  ];

  if (!q || q.trim() === "") {
    return res.json({ results: [] });
  }

  const results = data.filter(item =>
    item.toLowerCase().includes(q)
  );

  console.log(results);
  res.json({ results });
});

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
