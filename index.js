const express = require('express')

const app = express()

app.use(express.json())
app.use(registerRequestLog)

const projects = []
const requestLog = []

function verifyProjectExists(req, res, next) {
    const {id} = req.params

    if(!projects.find(p => p.id === id)){
        return res.status(400).send({error: 'Project not found'})
    }

    next()
}

function registerRequestLog(req, res, next) {
    
    const {method} = req
    const date = Date()

    requestLog.push({method, date})

    console.log(`Total request ${requestLog.length}`)
    console.log(requestLog)

    next()
}

app.get('/projects', (req, res) => {
    return res.json(projects)
})

app.get('/projects/:id', verifyProjectExists, (req, res) => {
    const {id} = req.params

    const project = projects.find(p => p.id === id)

    return res.json(project)
})

app.post('/projects', (req, res) => {
    const {id, title, tasks} = req.body

    projects.push({id, title, tasks})

    return res.status(200).send({status: 'Success'})
})

app.put('/projects/:id', verifyProjectExists, (req, res) => {
    const {id} = req.params
    const {title} = req.body

    const project = projects.find(p => p.id === id)

    project.title = title

    return res.json(project)
})

app.delete('/projects/:id', verifyProjectExists, (req, res) => {
    const {id} = req.params

    projects.shift(id, 1)

    return res.json({status: 'Success'})
})

app.post('/projects/:id/tasks', verifyProjectExists, (req, res) => {
    const {id} = req.params
    const {title} = req.body

    const project = projects.find(p => p.id === id)
    
    console.log(project.tasks.push(title))

    return res.json({status: 'Ok'})
})

app.listen(3000)