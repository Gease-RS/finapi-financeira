const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = []

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers
  const customer = customers.find(c => c.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: 'Customer does not exists' });
  }

  req.customer = customer;

  return next();
}

app.post('/account', (req, res) => {
    const {cpf, name }= req.body

    //<some> retornar verdadeiro ou falso conforme a condição
    const customerAlreadyExists = customers.some(
        customer => customer.cpf === cpf
    )
    if(customerAlreadyExists){
        return res.status(400).json({error: 'Customer already exists!'})
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })

    return res.status(201).send()
})

//app.use(verifyIfExistsAccountCPF)

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req;

    return res.json(customer.statement)
})

app.listen(3333, () => {
    console.log('🚀 Server started on port 3333!')
})