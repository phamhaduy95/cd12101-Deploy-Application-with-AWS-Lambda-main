import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const TODOS_TABLE = process.env.TODOS_TABLE

// using local secondary index return empty list for some reason :(
const TODOS_CREATED_AT_INDEX = process.env.TODOS_CREATED_AT_INDEX

export const getToDoList = async (userId) => {
  const result = await dynamoDbDocument.query({
    TableName: TODOS_TABLE,
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

export const updateToDo = async (userId, todoId, updateData) => {
  const { name, dueDate, done } = updateData
  await dynamoDbDocument.update({
    TableName: TODOS_TABLE,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'SET #fake_name =:name,dueDate =:dueDate,done =:done',
    ExpressionAttributeValues: {
      ':name': name,
      ':dueDate': dueDate,
      ':done': done
    },
    ExpressionAttributeNames: { '#fake_name': 'name' }
  })
}

export const addAttachment = async (userId, todoId, attachmentURL) => {
  await dynamoDbDocument.update({
    TableName: TODOS_TABLE,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'SET  attachmentURL =:url',
    ExpressionAttributeValues: {
      ':url': attachmentURL
    }
  })
}
