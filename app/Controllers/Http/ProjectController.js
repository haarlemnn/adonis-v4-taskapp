'use strict'

const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    try {
      const { page } = request.get()
      const projects = await Project.query().with('user').paginate(page)

      return projects
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível listar os projetos.' }})
    }
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['title', 'description'])

      const project = await Project.create({ ...data, user_id: auth.user.id })

      return project
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não possível cadastrar o projeto.' }})
    }
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível encontrar o projeto.' }})
    }
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      const data = request.only(['title', 'description'])

      project.merge(data)

      await project.save()

      return project
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível atualizar o projeto.' }})
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      await project.delete()
    } catch (error) {
      return response.status(error.status).json({ error: { message: 'Não foi possível deletar o projeto.' }})
    }
  }
}

module.exports = ProjectController
