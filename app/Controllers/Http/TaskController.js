'use strict'

const Task = use('App/Models/Task')

class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, response }) {
    try {
      const tasks = await Task.query().where('project_id', params.projects_id).with('user').fetch()

      return tasks
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível listar as tarefas.' }})
    }
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request, response }) {
    try {
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])
  
      const task = await Task.create({ ...data, project_id: params.projects_id })
  
      return task
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não possível criar a tarefa.' }})
    }
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      return task
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível encontrar a tarefa.' }})
    }
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id)
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      task.merge(data)

      await task.save()

      return task
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível atualizar a tarefa.' }})
    }
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      await task.delete()
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível deletar a tarefa.' }})
    }
  }
}

module.exports = TaskController
