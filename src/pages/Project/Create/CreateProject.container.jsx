import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import CreateProject from './CreateProject'
import { createProject, updateProject, deleteProject } from 'api'
import { alertsActions } from 'actions/alerts'
import { errorsActions } from 'actions/errors'
import routes from 'routes'

export default ({ onCancel, project }) => {
  const { pathname } = useLocation()
  const isSettings = routes.project_settings === pathname
  const history = useHistory()
  const dispatch = useDispatch()
  const { name, id } = project || {}

  const onSubmit = async (data) => {
    try {
      if (pathname === routes.new_project) {
        await createProject(data)
        dispatch(alertsActions.newProject('The project has been created'))
      }

      if (pathname === routes.project_settings) {
        await updateProject(id, data)
        dispatch(alertsActions.newProject('The project\'s settings were updated'))
      }

      history.push(routes.dashboard)
    } catch (e) {
      if (pathname === routes.new_project) {
        dispatch(errorsActions.createNewProjectFailed(e))
      }

      if (pathname === routes.project_settings) {
        dispatch(errorsActions.updateProjectFailed(e))
      }
    }
  }

  const onDelete = async () => {
    try {
      await deleteProject(id)
      dispatch(alertsActions.projectDeleted('The project has been deleted'))
      history.push(routes.dashboard)
    } catch (e) {
      dispatch(errorsActions.deleteProjectFailed(e))
    }
  }

  return (
    <CreateProject
      onSubmit={onSubmit}
      onDelete={onDelete}
      onCancel={onCancel}
      name={name}
      id={id}
      isSettings
      />
  )
}