import { createApp, ref, computed, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import interferenceData from '../data/data.js'
import aircraftTypes from '../data/aircraft_types.js'

createApp({
  setup() {
    interferenceData.forEach((date) => {
      date.aircraft.forEach((aircraft, idx) => {
        const find = aircraftTypes.find(item => item.type == aircraft.type)
        date.aircraft[idx].name = find.name
        date.aircraft[idx].color = find.color
      })
      date.aircraft.sort((a, b) => {
        return parseInt(a.color.replace('#', ''), 16) - parseInt(b.color.replace('#', ''), 16)
      })
    })

    const dateData = ref([])
    const minDate = new Date(interferenceData[interferenceData.length - 1].date).getTime()
    const maxDate = new Date(interferenceData[0].date).getTime()

    for (let i = minDate; i <= maxDate; i += 86400000) {
      const date = new Date(i).toLocaleDateString('sv')
      const find = interferenceData.find(item => item.date === date)

      if (find) {
        find.totalAircraftCount = find.aircraft.map(item => item.count).reduce((a, b) => a + b, 0)
      }

      dateData.value.push(find || { date, aircraft: [], totalAircraftCount: 0 })
    }

    const maxCountADay = ref(Math.max(...dateData.value.map(item => item.totalAircraftCount)))

    // timeline
    const currentDateIdx = ref(0)
    onMounted(() => {
      const scroller = document.querySelector('.scroller')
      scroller.addEventListener('scroll', (event) => {
        console.log(scroller.scrollLeft)
        const half = scroller.clientWidth / 2
        const allDate = document.querySelectorAll('.date')
        let current = 0

        for (let i = 0; i < allDate.length; i++) {
          const barLeft = allDate[i].offsetLeft - scroller.scrollLeft - 1
          const barWidth = barLeft + 15

          if (half >= barLeft && half < barWidth) {
            currentDateIdx.value = i
            break
          }
        }
      })

      // scroll by drag
      let mouseDown = false
      let startX, scrollLeft

      const startDragging = (e) => {
        mouseDown = true
        startX = e.pageX - scroller.offsetLeft
        scrollLeft = scroller.scrollLeft
      }

      const stopDragging = (e) => {
        mouseDown = false
      }

      const move = (e) => {
        e.preventDefault()
        if(!mouseDown) { return }
        const x = e.pageX - scroller.offsetLeft
        const scroll = x - startX
        scroller.scrollLeft = scrollLeft - scroll
      }

      // Add the event listeners
      scroller.addEventListener('mousemove', move, false)
      scroller.addEventListener('mousedown', startDragging, false)
      scroller.addEventListener('mouseup', stopDragging, false)
      scroller.addEventListener('mouseleave', stopDragging, false)

      // slide to right at start
      scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth - 10
    })

    const currentDate = computed(() => {
      return dateData.value[currentDateIdx.value]
    })

    return {
      dateData,
      maxCountADay,
      aircraftTypes,
      currentDateIdx,
      currentDate
    }
  }
}).mount('.app')