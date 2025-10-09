import useClipboard from 'vue-clipboard3'
import { useToast } from './useToast'

export const useCopy = () => {
  const { _toast } = useToast()
  const { toClipboard } = useClipboard()

  const _copy = async (text) => {
    try {
      await toClipboard(`${text}`)
      _toast('copy_success')
    } catch (e) {
      _toast('copy_error')
    }
  }
  return {
    _copy
  }
}
