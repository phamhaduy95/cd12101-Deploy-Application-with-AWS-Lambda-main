import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const TODOS_TABLE = process.env.TODOS_TABLE
const TODOS_CREATED_AT_INDEX = process.env.TODOS_CREATED_AT_INDEX

export const getToDoList = async (userId) => {
  const result = await dynamoDbDocument.query({
    TableName: TODOS_TABLE,
    IndexName: TODOS_CREATED_AT_INDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })

  return result.Items
}

export const createToDo = async (newTodo) => {
  await dynamoDbDocument.put({
    TableName: TODOS_TABLE,
    Item: newTodo
  })
}

export const deleteToDo = async (userId, todoId) => {
  return await dynamoDbDocument.delete({
    TableName: TODOS_TABLE,
    Key: {
      userId: userId,
      todoId: todoId
    }
  })
}

export const updateToDo = async (userId, todoId, todoData) => {
  await dynamoDbDocument.put({
    TableName: TODOS_TABLE,
    Item: { ...todoData, userId, todoId }
  })
}
