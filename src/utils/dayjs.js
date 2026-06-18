// src/utils/dayjs.js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localePt from 'dayjs/locale/pt'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(localePt)

export default dayjs