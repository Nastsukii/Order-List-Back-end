    const express = require('express')
    const { stat } = require('fs')
    const uuid = require('uuid')
    const {request} = ('http')
    const port = 3000
    const app = express()
    app.use(express.json())

    app.listen(port, ()=>{
        console.log(`Starting server on port ${port}.`)
    })
    
    const orders = []

const checkId = (request, response, next) =>{
    const {id} = request.params
    const index = orders.findIndex(order=> order.id === id)
    if(index < 0){
        return response.status(404).json('Order not found')
    }
    request.orderIndex = index
    request.orderId = id
    next()
    }

app.get("/order",(request, response)=>{
    return response.json(orders)
})

app.post("/order",(request, response)=>{
    const {order, clientName, price} = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status:"Em preparação"}
    orders.push(newOrder)
    return response.status(201).json(newOrder)
})

app.put("/order/:id",checkId,(request, response)=>{
    const {order, clientName, price} = request.body
    const id = request.orderId
    const orderUpdate = {id, order, clientName, price, status:"Em preparação"}
    const index = request.orderIndex
    orders[index] = orderUpdate
    return response.json(orderUpdate)
})

app.delete("/order/:id",checkId,(request, response)=>{
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(201).json("Order deleted successfully")
})

app.get("/order/:id",checkId, (request, response)=>{
    const index = request.orderIndex
    const order = orders[index]
    return response.status(201).json(order)
})
/*          PATCH UTILIZANDO O .FIND
app.patch("/order/:id",(request, response)=>{
    const { id } = request.params;
    const order = orders.find(order => order.id === id);
    if (order < 0) {
        return response.status(404).json({ error: 'Pedido não encontrado.' });
    }
    order.status = 'Pronto';
    return response.json(order);
})
*/
app.patch("/order/:id", checkId,(request, response) => {
    const index = request.orderIndex
    orders[index].status = 'Pronto'
    return response.json(orders[index])
});