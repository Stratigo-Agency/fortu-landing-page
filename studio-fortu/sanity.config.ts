import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const shared = {
  projectId: 'mb1o2t9p',
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
}

/**
 * Two workspaces on the same Studio: switch between them from the menu at the top left.
 * - Production: the live website content.
 * - Staging: the test content shown on the staging website (safe place to try changes and get feedback).
 */
export default defineConfig([
  {...shared, name: 'production', title: 'Fortu (Production)', basePath: '/production', dataset: 'production'},
  {...shared, name: 'staging', title: 'Fortu (Staging)', basePath: '/staging', dataset: 'staging'},
])
