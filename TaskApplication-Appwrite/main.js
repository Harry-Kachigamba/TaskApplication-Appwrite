import './style.css'
import {Client, Databases, ID} from 'appwrite'

const client = new Client()

//best practise add to .env file
const DATABASE_ID = '<DATABASE_ID>';
const COLLECTION_ID_TASKS = '<COLLECTION_ID_TASKS>';

client.setEndpoint('https://cloud.appwrite.io/v1')
client.setProject('<PROJECT_ID>')

const db = new Databases(client)

const tasksList = document.getElementById('tasks-collection')
const form = document.getElementById('form')

form.addEventListener('submit', addTask)
getTasks()

async function getTasks () {
  const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID_TASKS)

  const tasks = response.documents
 
  for(let i=0; tasks.length > i; i++){
    renderItemToDom(tasks[i])
  }
}

const renderItemToDom = async (task) => {


  //add item
  const taskWrapper = `<div class="task-wrapper" id="task-${task.$id}">
                          <p class="complete-${task.completed}">${task.body}</p>
                          <strong class="delete" id="delete-${task.$id}">x</strong>
                      </div>`

  tasksList.insertAdjacentHTML('afterbegin', taskWrapper)

  const deleteBtn = document.getElementById(`delete-${task.$id}`)
  const wrapper = document.getElementById(`task-${task.$id}`)

  //delete task function
  deleteBtn.addEventListener('click', () => {
     db.deleteDocument(DATABASE_ID, COLLECTION_ID_TASKS, task.$id)
     document.getElementById(`task-${task.$id}`).remove()
  })

  //update task
  wrapper.childNodes[1].addEventListener('click', async (e) => {

    task.completed = !task.completed
    e.target.className = `complete-${task.completed}`

    db.updateDocument(
      DATABASE_ID,
      COLLECTION_ID_TASKS,
      task.$id,
      {'completed':task.completed}
      )

  })
}

async function addTask (e)  {
  e.preventDefault()

  if(e.target.body.value == ''){
    alert("Form field cannot be empty")
    return
  }

  const response = await db.createDocument(
      DATABASE_ID, 
      COLLECTION_ID_TASKS,
      ID.unique(),
      {"body":e.target.body.value}
    )

    renderItemToDom(response)
    form.reset()

}