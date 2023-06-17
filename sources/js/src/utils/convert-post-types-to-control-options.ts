import {EntitiesSearch} from '../@types'

// TODO Return an Immutable collection (use Immutable JS)
export function convertPostTypesToControlOptions(
  postTypes: EntitiesSearch.EditablePostType[]
): EntitiesSearch.ControlOption<string>[] {
  return postTypes.map(postType => ({
    label: postType.name,
    value: postType.slug,
  }))
}
