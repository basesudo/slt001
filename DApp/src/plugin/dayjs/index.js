import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import buddhistEra from 'dayjs/plugin/buddhistEra'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(buddhistEra)

export default dayjs
