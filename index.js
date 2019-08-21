const express = require("express");

const server = express();
server.use(express.json());

let counterRequest = 0; //contador de requisições
const projects = [];

function counterRequestLog(req, res, next) {
  counterRequest++; //middleware global para contagem de requisições
  console.log(`Requisições feitas: ${counterRequest}`);
  return next();
}

server.use(counterRequestLog); //Call do middleware

function validateProject(req, res, next) {
  //middleware para verificar se projeto existe.
  //usado onde é necessario passar o id na requisição
  const { id } = req.params;
  const validarId = projects.find(k => k.id === id);
  // const validarId = projects.find(function(element) {
  //   if (element.id === id) {
  //     return id;
  //   }
  // });
  if (!validarId) {
    return res.status(400).json({ erro: "project not found" });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  //adicionando projeto
  const addProject = {
    id,
    title,
    tasks: []
  };

  projects.push(addProject);
  return res.json(addProject);
});

server.get("/projects", (req, res) => {
  //listando todos os projetos
  return res.json(projects);
});

server.put("/projects/:id", validateProject, (req, res) => {
  //alternando title do projeto
  const { id } = req.params;
  const { title } = req.body;

  const alterTitle = projects.find(k => k.id === id);
  // const alterTitle = projects.find(function(element) {
  //   if (element.id === id) {
  //     return id;
  //   }
  // });

  alterTitle.title = title;
  return res.json(alterTitle);
});

server.delete("/projects/:id", validateProject, (req, res) => {
  const { id } = req.params;
  //Deletar usuario
  const delProject = projects.find(k => k.id === id);
  // const delProject = projects.find(function(element) {
  //   if (element.id === id) {
  //     return id;
  //   }
  // });

  projects.splice(delProject, 1);
  return res.send();
});

server.post("/projects/:id/tasks", validateProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  //adicionar tarefa a um projeto
  const addTaks = projects.find(k => k.id === id);
  // const addTaks = projects.find(function(element) {
  //   if (element.id === id) {
  //     return id;
  //   }
  // });

  addTaks.tasks.push(title);
  return res.json(addTaks);
});

server.listen(3000);
