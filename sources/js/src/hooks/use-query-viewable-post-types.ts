import {EntitiesSearch} from '../@types'

import {useSelect} from '@wordpress/data'

type Selectors = {
  getPostTypes(): EntitiesSearch.EditablePostType[] | null
}

// TODO Return an Immutable collection (use Immutable JS)
export function useQueryViewablePostTypes() {
  const coreSelectors = useSelect((select: (store: string) => Selectors) => select('core'), [])
  const postTypes = coreSelectors.getPostTypes()

  if (postTypes === null) {
    return null
  }

  return postTypes.filter(
    postType => postType.viewable
  ) as EntitiesSearch.EditableViewablePostType[]
}
